import httpStatus from "http-status";
import { AppError } from "../errorHandler/AppError";

/*
 * What a delete would do, for the confirm dialog: what stops it (history that must stay),
 * and what goes with the record. The same check runs again inside the delete's transaction.
 */
export type Blocker = { key: string; count: number; message: string };
export type DeleteCheck = { canDelete: boolean; blockers: Blocker[]; willRemove: Record<string, number> };

/* A blocker when count > 0. The key names it for the client's translations. */
export const blocker = (key: string, count: number, message: string): Blocker | null =>
  count > 0 ? { key, count, message } : null;

export const deleteCheck = (blockers: (Blocker | null)[], willRemove: Record<string, number> = {}): DeleteCheck => {
  const found = blockers.filter((b): b is Blocker => b !== null);
  return { canDelete: found.length === 0, blockers: found, willRemove };
};

export const assertDeletable = (check: DeleteCheck, hint?: string) => {
  if (check.canDelete) return;
  const why = check.blockers.map((b) => b.message).join("; ");
  throw new AppError(`This cannot be deleted: ${why}${hint ? `. ${hint}` : ""}`, httpStatus.CONFLICT);
};
