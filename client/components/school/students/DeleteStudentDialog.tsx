"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/data/ConfirmActionDialog";
import { useLocalizedName } from "@/lib/i18n/names";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteCheck } from "@/lib/school/deletes";
import { useDeleteStudent, type StudentDetail } from "@/lib/school/students";

/** Deletes a student added by mistake; the server refuses one with money, attendance or marks. */
export function DeleteStudentDialog({
  student,
  open,
  onClose,
  onDeleted,
}: {
  student: StudentDetail;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const t = useTranslations("deletes.student");
  const name = useLocalizedName();
  const describeError = useErrorMessage();
  const check = useDeleteCheck(open ? `/student/${student.id}/delete-check` : null);
  const remove = useDeleteStudent();
  const [error, setError] = useState<string | null>(null);

  return (
    <ConfirmActionDialog
      open={open}
      onClose={() => {
        setError(null);
        onClose();
      }}
      title={t("title", { name: name(student) })}
      warning={t("description")}
      check={check}
      pending={remove.isPending}
      error={error}
      onConfirm={() =>
        remove.mutate(
          { studentId: student.id },
          {
            onSuccess: () => {
              toast.success(t("done", { name: name(student) }));
              onDeleted();
            },
            onError: (e) => setError(describeError(e)),
          },
        )
      }
    />
  );
}
