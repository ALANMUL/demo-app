"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/data/ConfirmActionDialog";
import { useLocalizedName } from "@/lib/i18n/names";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteCheck } from "@/lib/school/deletes";
import { localPhone } from "@/lib/school/students";
import { useDeleteTeacher, type TeacherDetail } from "@/lib/school/teachers";

/** Deletes a teacher added by mistake; one with history is refused (they leave instead). */
export function DeleteTeacherDialog({
  teacher,
  open,
  onClose,
  onDeleted,
}: {
  teacher: TeacherDetail;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const t = useTranslations("deletes.teacher");
  const name = useLocalizedName();
  const describeError = useErrorMessage();
  const check = useDeleteCheck(open ? `/teacher/${teacher.id}/delete-check` : null);
  const remove = useDeleteTeacher();
  const [error, setError] = useState<string | null>(null);
  const teacherName = name(teacher);

  return (
    <ConfirmActionDialog
      open={open}
      onClose={() => {
        setError(null);
        onClose();
      }}
      title={t("title", { name: teacherName })}
      description={t("description")}
      check={check}
      reason="optional"
      // their login number is easier to type than a name in either script
      confirmText={teacher.membership.user.phone ? localPhone(teacher.membership.user.phone) : teacherName}
      pending={remove.isPending}
      error={error}
      onConfirm={({ reason }) =>
        remove.mutate(
          { teacherId: teacher.id, reason: reason || undefined },
          {
            onSuccess: () => {
              toast.success(t("done", { name: teacherName }));
              onDeleted();
            },
            onError: (e) => setError(describeError(e)),
          },
        )
      }
    />
  );
}
