import httpStatus from "http-status";
import type { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../errorHandler/AppError";
import { endOfBangladeshDay } from "../../shared/scheduleSchemas";
import type { AuditLogListQuery } from "./auditLog.validation";

const BD_OFFSET_MS = 6 * 3_600_000;

/* The school's deletions and money reversals, newest first (without the snapshots). */
const list = async (schoolId: string, query: AuditLogListQuery) => {
  const { action, entityType, entityId, from, to, page, limit } = query;
  const where: Prisma.AuditLogWhereInput = {
    schoolId,
    ...(action ? { OR: [{ action }, { action: { startsWith: `${action}.` } }] } : {}),
    ...(entityType ? { entityType } : {}),
    ...(entityId ? { entityId } : {}),
    ...(from || to
      ? {
          createdAt: {
            // a Bangladesh day starts at 18:00 UTC the day before
            ...(from ? { gte: new Date(from.getTime() - BD_OFFSET_MS) } : {}),
            ...(to ? { lt: endOfBangladeshDay(to) } : {}),
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      omit: { snapshot: true },
    }),
    prisma.auditLog.count({ where }),
  ]);
  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

/* One entry with its snapshot. */
const getOne = async (schoolId: string, logId: string) => {
  const log = await prisma.auditLog.findFirst({ where: { id: logId, schoolId } });
  if (!log) throw new AppError("Log entry not found", httpStatus.NOT_FOUND);
  return log;
};

export const AuditLogService = { list, getOne };
