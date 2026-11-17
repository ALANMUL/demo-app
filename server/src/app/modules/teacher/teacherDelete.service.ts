import httpStatus from "http-status";
import type { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../errorHandler/AppError";
import { writeAuditLog } from "../../shared/auditLog";
import { deleteCheck } from "../../shared/deleteCheck";
import type { OptionalReasonQuery } from "../../shared/deleteSchemas";
import { displayName } from "../../shared/names";
import { revokeSchoolRole, TEACHER_ROLE } from "../../shared/schoolAccounts";
import { deleteFile } from "../../shared/storage";
import { queueDeviceRemoval } from "../attendanceDevice/people.service";

/*
 * Deleting a teacher, with their attendance, subject assignments, substitutions and exam
 * duties. Their routine periods and class-teacher posts stay, without a teacher. The account
 * stays too (it may be used at another school or as a guardian here): it loses the TEACHER
 * role here, as when a teacher leaves. Nothing blocks it: teachers have no money records.
 */

type Db = Prisma.TransactionClient | typeof prisma;
type Auth = NonNullable<Express.Request["auth"]>;

const TX_OPTIONS = { maxWait: 10_000, timeout: 60_000 };

const check = async (db: Db, teacher: { id: string; membershipId: string }) => {
  const [attendance, subjectAssignments, routine, substitutions, duties, classTeacher] = await Promise.all([
    db.teacherAttendance.count({ where: { teacherId: teacher.id } }),
    db.subjectTeacher.count({ where: { teacherId: teacher.id } }),
    db.routineEntry.count({ where: { teacherId: teacher.id } }),
    db.routineSubstitution.count({ where: { teacherId: teacher.id } }),
    db.invigilatorDuty.count({ where: { teacherId: teacher.id } }),
    db.sectionYearConfig.count({ where: { classTeacherMembershipId: teacher.membershipId } }),
  ]);
  return deleteCheck([], { attendance, subjectAssignments, routineCleared: routine, substitutions, duties, classTeacherCleared: classTeacher });
};

const findTeacher = async (db: Db, schoolId: string, teacherId: string) => {
  const teacher = await db.teacherProfile.findFirst({
    where: { id: teacherId, schoolId },
    include: { membership: { select: { userId: true } }, devicePerson: { select: { pin: true } } },
  });
  if (!teacher) throw new AppError("Teacher not found", httpStatus.NOT_FOUND);
  return teacher;
};

const deleteCheckFor = async (schoolId: string, teacherId: string) => check(prisma, await findTeacher(prisma, schoolId, teacherId));

const deleteTeacher = async (auth: Auth, teacherId: string, query: OptionalReasonQuery) => {
  const schoolId = auth.schoolId!;
  let photo: string | null = null;

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TeacherProfile" WHERE "id" = ${teacherId} AND "schoolId" = ${schoolId} FOR UPDATE`;
    const teacher = await findTeacher(tx, schoolId, teacherId);
    const result = await check(tx, teacher);

    await tx.teacherAttendance.deleteMany({ where: { teacherId } });
    await tx.subjectTeacher.deleteMany({ where: { teacherId } });
    await tx.routineSubstitution.deleteMany({ where: { teacherId } });
    await tx.routineEntry.updateMany({ where: { teacherId }, data: { teacherId: null } });
    await tx.sectionYearConfig.updateMany({ where: { classTeacherMembershipId: teacher.membershipId }, data: { classTeacherMembershipId: null } });
    if (teacher.devicePerson) await queueDeviceRemoval(tx, schoolId, teacher.devicePerson.pin);
    // exam duties and the device entry go by cascade
    await tx.teacherProfile.delete({ where: { id: teacherId } });
    await revokeSchoolRole(tx, schoolId, teacher.membership.userId, TEACHER_ROLE.name);

    await writeAuditLog(tx, auth, {
      action: "teacher.delete",
      entityType: "TeacherProfile",
      entityId: teacherId,
      summary: displayName(teacher),
      reason: query.reason,
      snapshot: { teacher, removed: result.willRemove },
    });
    photo = teacher.photo;
  }, TX_OPTIONS);

  await deleteFile(photo);
  return { id: teacherId };
};

export const TeacherDeleteService = { deleteCheck: deleteCheckFor, deleteTeacher };
