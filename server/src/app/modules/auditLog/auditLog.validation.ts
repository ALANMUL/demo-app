import { z } from "zod";
import { dateOnlySchema } from "../../shared/scheduleSchemas";

const listQuery = z
  .object({
    // "payment" matches every payment.* action
    action: z.string().trim().min(1).max(60).optional(),
    entityType: z.string().trim().min(1).max(60).optional(),
    entityId: z.string().trim().min(1).max(60).optional(),
    // Bangladesh calendar days
    from: dateOnlySchema.optional(),
    to: dateOnlySchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine((d) => !d.from || !d.to || d.from <= d.to, { message: "'from' must be earlier than 'to'", path: ["to"] });

const logIdParams = z.object({ logId: z.string().trim().min(1).max(60) });

export const AuditLogValidation = { listQuery, logIdParams };

export type AuditLogListQuery = z.infer<typeof listQuery>;
