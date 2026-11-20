import httpStatus from "http-status";
import type { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../errorHandler/AppError";
import { writeAuditLog } from "../../shared/auditLog";
import { deleteCheck, type DeleteCheck } from "../../shared/deleteCheck";
import { displayName } from "../../shared/names";
import type { DeleteExamQuery } from "./exam.validation";

/*
 * Deleting an exam, or taking one class out of it, at any stage (the super admin only, see
 * the routes), after a warning (a stronger one once marks or results exist: see `level`).
 * Marks, results, remarks and the seat plan go with it; the marks are kept in the
 * activity log. A final result built from the exam loses it: it goes back to draft and its
 * published final results are deleted, to be published again from the remaining exams.
 */

type Db = Prisma.TransactionClient | typeof prisma;
type Tx = Prisma.TransactionClient;
type Auth = NonNullable<Express.Request["auth"]>;
type Scope = { examId: string; classId?: string };
export type ExamDeleteLevel = "SIMPLE" | "SUPER_ADMIN";

const TX_OPTIONS = { maxWait: 10_000, timeout: 60_000 };

// ------------------------------------------------------- shared with class delete

/* The final results that use the exam (for one class, or all): out it goes, back to draft. */
export const detachFromFinalResults = async (tx: Tx, examId: string, classId?: string) => {
  const links = await tx.finalResultComponentExam.findMany({
    where: { examId, ...(classId ? { component: { formula: { classId } } } : {}) },
    select: { id: true, component: { select: { formulaId: true } } },
  });
  if (links.length === 0) return 0;
  const formulaIds = [...new Set(links.map((l) => l.component.formulaId))];
  await tx.finalResultComponentExam.deleteMany({ where: { id: { in: links.map((l) => l.id) } } });
  await tx.finalResult.deleteMany({ where: { formulaId: { in: formulaIds } } });
  await tx.finalResultFormula.updateMany({
    where: { id: { in: formulaIds } },
    data: { status: "DRAFT", publishedAt: null, publishedBy: null },
  });
  return formulaIds.length;
};

/* Exam classes with their marks (held by Restrict); subjects, results and remarks cascade. */
export const deleteExamClasses = async (tx: Tx, examClassIds: string[]) => {
  if (examClassIds.length === 0) return;
  await tx.examMark.deleteMany({ where: { examSubject: { examClassId: { in: examClassIds } } } });
  await tx.examClass.deleteMany({ where: { id: { in: examClassIds } } });
};

// -------------------------------------------------------------------- delete

const findExam = async (db: Db, schoolId: string, scope: Scope) => {
  const exam = await db.exam.findFirst({
    where: { id: scope.examId, schoolId },
    include: {
      academicYear: { select: { id: true, name: true } },
      classes: {
        where: scope.classId ? { classId: scope.classId } : {},
        select: { id: true, classId: true, status: true, publishedAt: true, class: { select: { name: true } } },
      },
    },
  });
  if (!exam) throw new AppError("Exam not found", httpStatus.NOT_FOUND);
  if (scope.classId && exam.classes.length === 0) throw new AppError("This class is not part of the exam", httpStatus.NOT_FOUND);
  return exam;
};

type Exam = Awaited<ReturnType<typeof findExam>>;

const check = async (db: Db, exam: Exam, scope: Scope): Promise<DeleteCheck & { level: ExamDeleteLevel }> => {
  const inClasses = { examClassId: { in: exam.classes.map((c) => c.id) } };
  const [marks, results, remarks, subjects, finalResults, seatPlans] = await Promise.all([
    db.examMark.count({ where: { examSubject: inClasses } }),
    db.examResult.count({ where: inClasses }),
    db.examRemark.count({ where: inClasses }),
    db.examSubject.count({ where: inClasses }),
    db.finalResultComponentExam.count({ where: { examId: exam.id, ...(scope.classId ? { component: { formula: { classId: scope.classId } } } : {}) } }),
    scope.classId ? Promise.resolve(0) : db.seatPlan.count({ where: { examId: exam.id } }),
  ]);
  const published = exam.classes.filter((c) => c.status === "PUBLISHED").length;
  const result = deleteCheck([], { classes: exam.classes.length, publishedClasses: published, subjects, marks, results, remarks, seatPlans, finalResults });
  return { ...result, level: marks > 0 || results > 0 || published > 0 ? "SUPER_ADMIN" : "SIMPLE" };
};

const deleteCheckFor = async (schoolId: string, scope: Scope) => check(prisma, await findExam(prisma, schoolId, scope), scope);


const remove = async (auth: Auth, scope: Scope, query: DeleteExamQuery) => {
  const schoolId = auth.schoolId!;
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Exam" WHERE "id" = ${scope.examId} AND "schoolId" = ${schoolId} FOR UPDATE`;
    const exam = await findExam(tx, schoolId, scope);
    const result = await check(tx, exam, scope);

    const examClassIds = exam.classes.map((c) => c.id);
    const marks = await tx.examMark.findMany({
      where: { examSubject: { examClassId: { in: examClassIds } } },
      select: { studentId: true, examSubjectId: true, isAbsent: true, total: true, partMarks: true, enteredBy: true },
    });
    const subjects = await tx.examSubject.findMany({
      where: { examClassId: { in: examClassIds } },
      select: { id: true, examClassId: true, classSubjectId: true, fullMarks: true, passMarks: true, date: true },
    });

    await detachFromFinalResults(tx, exam.id, scope.classId);
    await deleteExamClasses(tx, examClassIds);
    // the seat plan goes with the exam by cascade
    if (!scope.classId) await tx.exam.delete({ where: { id: exam.id } });

    const what = scope.classId ? `${displayName(exam)} · ${exam.classes[0].class.name}` : displayName(exam);
    await writeAuditLog(tx, auth, {
      action: scope.classId ? "exam.class.remove" : "exam.delete",
      entityType: scope.classId ? "ExamClass" : "Exam",
      entityId: scope.classId ? examClassIds[0] : exam.id,
      summary: `${what} (${exam.academicYear.name})${result.willRemove.marks ? ` · ${result.willRemove.marks} marks` : ""}`,
      reason: query.reason,
      snapshot: { exam, removed: result.willRemove, subjects, marks },
    });
  }, TX_OPTIONS);
};

export const ExamDeleteService = {
  deleteCheck: deleteCheckFor,
  deleteExam: (auth: Auth, examId: string, query: DeleteExamQuery) => remove(auth, { examId }, query),
  removeClass: (auth: Auth, examId: string, classId: string, query: DeleteExamQuery) => remove(auth, { examId, classId }, query),
};
