import httpStatus from "http-status";
import type { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../errorHandler/AppError";
import type { AnnouncementListQuery, AnnouncementPayload } from "./announcement.validation";

type Auth = NonNullable<Express.Request["auth"]>;

/*
 * The platform's announcements to every school (a new feature, a change, maintenance).
 * The platform admin writes them; each school's super admin reads them in the header bell.
 * A school sees only the ones written after it joined, and each reader has their own
 * read marks.
 */

const pageMeta = (page: number, limit: number, total: number) => ({ page, limit, total, totalPages: Math.ceil(total / limit) });

// ============================================================== platform admin

const create = (userId: string, data: AnnouncementPayload) => prisma.platformAnnouncement.create({ data: { ...data, createdBy: userId } });

const listForPlatform = async ({ page, limit }: AnnouncementListQuery) => {
  const [items, total] = await Promise.all([
    prisma.platformAnnouncement.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { reads: true } } }, // how many super admins opened it
    }),
    prisma.platformAnnouncement.count(),
  ]);
  return { items, meta: pageMeta(page, limit, total) };
};

const findOne = async (announcementId: string) => {
  const announcement = await prisma.platformAnnouncement.findUnique({ where: { id: announcementId }, select: { id: true } });
  if (!announcement) throw new AppError("Announcement not found", httpStatus.NOT_FOUND);
};

/* An edit doesn't make it unread again: a fixed typo shouldn't ring every bell. */
const update = async (announcementId: string, data: AnnouncementPayload) => {
  await findOne(announcementId);
  return prisma.platformAnnouncement.update({ where: { id: announcementId }, data });
};

const remove = async (announcementId: string) => {
  await findOne(announcementId);
  // the read marks go with it
  await prisma.platformAnnouncement.delete({ where: { id: announcementId } });
};

// ============================================================== school super admin

/* The announcements this school may see: those written since it joined. */
const forSchool = async (schoolId: string): Promise<Prisma.PlatformAnnouncementWhereInput> => {
  const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { createdAt: true } });
  if (!school) throw new AppError("School not found", httpStatus.NOT_FOUND);
  return { createdAt: { gte: school.createdAt } };
};

const unreadWhere = (base: Prisma.PlatformAnnouncementWhereInput, userId: string): Prisma.PlatformAnnouncementWhereInput => ({
  ...base,
  reads: { none: { userId } },
});

const listForSchool = async (auth: Auth, { page, limit }: AnnouncementListQuery) => {
  const where = await forSchool(auth.schoolId!);
  const [rows, total, unread] = await Promise.all([
    prisma.platformAnnouncement.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        kind: true,
        titleEn: true,
        titleBn: true,
        bodyEn: true,
        bodyBn: true,
        createdAt: true,
        reads: { where: { userId: auth.userId }, select: { id: true } },
      },
    }),
    prisma.platformAnnouncement.count({ where }),
    prisma.platformAnnouncement.count({ where: unreadWhere(where, auth.userId) }),
  ]);

  return {
    items: rows.map(({ reads, ...row }) => ({ ...row, read: reads.length > 0 })),
    unread,
    meta: pageMeta(page, limit, total),
  };
};

/* Just the bell's number. */
const unreadCount = async (auth: Auth) => ({
  unread: await prisma.platformAnnouncement.count({ where: unreadWhere(await forSchool(auth.schoolId!), auth.userId) }),
});

const markRead = async (auth: Auth, announcementId: string) => {
  const where = await forSchool(auth.schoolId!);
  const announcement = await prisma.platformAnnouncement.findFirst({ where: { ...where, id: announcementId }, select: { id: true } });
  if (!announcement) throw new AppError("Announcement not found", httpStatus.NOT_FOUND);

  await prisma.platformAnnouncementRead.upsert({
    where: { announcementId_userId: { announcementId, userId: auth.userId } },
    create: { announcementId, userId: auth.userId },
    update: {},
  });
  return { unread: await prisma.platformAnnouncement.count({ where: unreadWhere(where, auth.userId) }) };
};

const markAllRead = async (auth: Auth) => {
  const unread = await prisma.platformAnnouncement.findMany({
    where: unreadWhere(await forSchool(auth.schoolId!), auth.userId),
    select: { id: true },
  });
  if (unread.length > 0) {
    await prisma.platformAnnouncementRead.createMany({
      data: unread.map((a) => ({ announcementId: a.id, userId: auth.userId })),
      skipDuplicates: true,
    });
  }
  return { unread: 0 };
};

export const AnnouncementService = { create, listForPlatform, update, remove, listForSchool, unreadCount, markRead, markAllRead };
