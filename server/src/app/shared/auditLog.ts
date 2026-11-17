import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

type Db = Prisma.TransactionClient | typeof prisma;
type Auth = NonNullable<Express.Request["auth"]>;

export type AuditEntry = {
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  reason?: string | null;
  // the record as it was; Decimals and Dates come out as strings
  snapshot: unknown;
};

/*
 * Records a deletion or a money reversal. Call it with the transaction that makes the
 * change, so the change and its record are saved together or not at all.
 */
export const writeAuditLog = async (db: Db, auth: Auth, entry: AuditEntry) => {
  const actor = await db.user.findUnique({ where: { id: auth.userId }, select: { fullname: true } });
  await db.auditLog.create({
    data: {
      schoolId: auth.schoolId!,
      actorUserId: auth.userId,
      actorName: actor?.fullname ?? "",
      viaPlatform: !!auth.isPlatformAdmin,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      summary: entry.summary.slice(0, 300),
      reason: entry.reason ?? null,
      snapshot: JSON.parse(JSON.stringify(entry.snapshot ?? null)) as Prisma.InputJsonValue,
    },
  });
};
