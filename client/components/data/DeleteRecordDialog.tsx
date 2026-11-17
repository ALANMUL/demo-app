"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/data/ConfirmActionDialog";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteCheck } from "@/lib/school/deletes";

/* What to delete: the texts are already translated; `run` does the delete with the reason. */
export type DeleteTarget = {
  title: string;
  description?: string;
  // GET path of the record's delete check, e.g. "/class/abc/delete-check"
  checkPath: string;
  // the word to type (a class's or a fund's name)
  confirmText?: string;
  done: string;
  run: (reason?: string) => Promise<unknown>;
};

/**
 * Deleting one record that takes others with it (a class, a section, a fee type, a class fee,
 * a fund): shows what stops it and what goes, asks a reason and the name typed, then deletes.
 */
export function DeleteRecordDialog({ target, onClose }: { target: DeleteTarget | null; onClose: () => void }) {
  const describeError = useErrorMessage();
  const check = useDeleteCheck(target?.checkPath ?? null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setError(null);
    onClose();
  };
  const confirm = async ({ reason }: { reason: string }) => {
    if (!target) return;
    setPending(true);
    try {
      await target.run(reason || undefined);
      toast.success(target.done);
      close();
    } catch (e) {
      setError(describeError(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <ConfirmActionDialog
      open={!!target}
      onClose={close}
      title={target?.title ?? ""}
      description={target?.description}
      check={target ? check : null}
      reason="optional"
      confirmText={target?.confirmText}
      pending={pending}
      error={error}
      onConfirm={confirm}
    />
  );
}
