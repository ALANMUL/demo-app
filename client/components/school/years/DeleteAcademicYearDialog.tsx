"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/data/ConfirmActionDialog";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteAcademicYear, type AcademicYear } from "@/lib/school/academicYears";
import { useDeleteCheck } from "@/lib/school/deletes";

/** Deletes a year made by mistake: never the current one, nothing enrolled or done in it. */
export function DeleteAcademicYearDialog({ year, onClose }: { year: AcademicYear | null; onClose: () => void }) {
  const t = useTranslations("deletes.year");
  const describeError = useErrorMessage();
  const check = useDeleteCheck(year ? `/academic-year/${year.id}/delete-check` : null);
  const remove = useDeleteAcademicYear();
  const [error, setError] = useState<string | null>(null);

  return (
    <ConfirmActionDialog
      open={!!year}
      onClose={() => {
        setError(null);
        onClose();
      }}
      title={t("title", { name: year?.name ?? "" })}
      description={t("description")}
      check={check}
      reason="optional"
      confirmText={year?.name}
      pending={remove.isPending}
      error={error}
      onConfirm={({ reason }) =>
        year &&
        remove.mutate(
          { yearId: year.id, reason: reason || undefined },
          {
            onSuccess: () => {
              toast.success(t("done", { name: year.name }));
              onClose();
            },
            onError: (e) => setError(describeError(e)),
          },
        )
      }
    />
  );
}
