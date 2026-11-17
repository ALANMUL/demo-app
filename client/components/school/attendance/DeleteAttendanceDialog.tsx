"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/data/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteStudentSheet, useDeleteTeacherSheet } from "@/lib/school/attendance";

/*
 * Deletes a day's roll call taken by mistake (a section's, or the teachers'), as if it was
 * never taken. Offered with the same day limit as changing it (the server checks it again).
 */
export function DeleteAttendanceButton({ target }: { target: { kind: "students"; sectionId: string; date: string } | { kind: "teachers"; date: string } }) {
  const t = useTranslations("deletes.attendance");
  const describeError = useErrorMessage();
  const students = useDeleteStudentSheet();
  const teachers = useDeleteTeacherSheet();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = students.isPending || teachers.isPending;

  const close = () => {
    setError(null);
    setOpen(false);
  };
  const confirm = ({ reason }: { reason: string }) => {
    const handlers = {
      onSuccess: ({ removed }: { removed: number }) => {
        toast.success(t("done", { count: removed }));
        close();
      },
      onError: (e: unknown) => setError(describeError(e)),
    };
    if (target.kind === "students") students.mutate({ sectionId: target.sectionId, date: target.date, reason: reason || undefined }, handlers);
    else teachers.mutate({ date: target.date, reason: reason || undefined }, handlers);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setOpen(true)}>
        <Trash2 /> {t("action")}
      </Button>
      <ConfirmActionDialog
        open={open}
        onClose={close}
        title={t(target.kind === "students" ? "titleStudents" : "titleTeachers", { date: target.date })}
        description={t("description")}
        reason="optional"
        pending={pending}
        error={error}
        onConfirm={confirm}
      />
    </>
  );
}
