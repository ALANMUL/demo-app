import { z } from "zod";

/* Why a record is deleted or a money entry reversed; kept in the audit log. */
export const reasonSchema = z.string({ error: "A reason is required!" }).trim().min(3, "Write a reason (at least 3 characters)").max(300);

export const reasonBody = z.object({ reason: reasonSchema });
/* The same, for a DELETE (no body): ?reason= */
export const reasonQuery = z.object({ reason: reasonSchema });
export type ReasonPayload = z.infer<typeof reasonBody>;

/* Deletes that are not money: the reason is optional, sent as ?reason= (a DELETE has no body). */
export const optionalReasonQuery = z.object({ reason: z.string().trim().max(300).optional() });
export type OptionalReasonQuery = z.infer<typeof optionalReasonQuery>;
