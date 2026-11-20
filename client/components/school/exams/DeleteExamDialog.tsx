"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/data/ConfirmActionDialog";
import { useSchoolMe } from "@/lib/auth/hooks";
import { useLocalizedName } from "@/lib/i18n/names";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteCheck, type ExamDeleteCheck } from "@/lib/school/deletes";
import { useDeleteExam, useRemoveExamClass, type Exam } from "@/lib/school/exams";

/* The whole exam, or one class taken out of it. */
export type ExamDeleteTarget = { exam: Exam; classId?: string; className?: string };

/**
 * Deletes an exam (or a class of it) at any stage, after a warning: a stronger one once there
 * are marks or a published result. The server keeps the marks in the activity log.
 */
export function DeleteExamDialog({ target, onClose, onDeleted }: { target: ExamDeleteTarget | null; onClose: () => void; onDeleted?: () => void }) {
  const t = useTranslations("deletes.exam");
  const name = useLocalizedName();
  const describeError = useErrorMessage();
  const me = useSchoolMe();
  const removeExam = useDeleteExam();
  const removeClass = useRemoveExamClass();
  const [error, setError] = useState<string | null>(null);

  const base = target ? `/exam/${target.exam.id}${target.classId ? `/classes/${target.classId}` : ""}` : null;
  const check = useDeleteCheck<ExamDeleteCheck>(base && `${base}/delete-check`);
  const strict = check.data?.level === "SUPER_ADMIN";
  // an exam with marks is the super admin's to delete: say so instead of offering the button
  const data =
    check.data && strict && !me?.isSuperAdmin
      ? { ...check.data, canDelete: false, blockers: [...check.data.blockers, { key: "superAdminOnly", count: 1, message: "" }] }
      : check.data;

  const examName = target ? name(target.exam) : "";
  const pending = removeExam.isPending || removeClass.isPending;
  const removed = check.data?.willRemove ?? {};

  const close = () => {
    setError(null);
    onClose();
  };
  const done = () => {
    toast.success(target?.classId ? t("classDone", { class: target.className ?? "" }) : t("done", { name: examName }));
    close();
    if (!target?.classId) onDeleted?.();
  };

  const confirm = () => {
    if (!target) return;
    const handlers = { onSuccess: done, onError: (e: unknown) => setError(describeError(e)) };
    if (target.classId) removeClass.mutate({ examId: target.exam.id, classId: target.classId }, handlers);
    else removeExam.mutate({ examId: target.exam.id }, handlers);
  };

  return (
    <ConfirmActionDialog
      open={!!target}
      onClose={close}
      title={target?.classId ? t("classTitle", { class: target.className ?? "", name: examName }) : t("title", { name: examName })}
      // a warning only: stronger once there are marks or a published result
      warning={strict ? t("warning", { marks: removed.marks ?? 0, published: removed.publishedClasses ?? 0 }) : t("description")}
      check={{ data, isPending: check.isPending, error: check.error }}
      pending={pending}
      error={error}
      onConfirm={confirm}
    />
  );
}
