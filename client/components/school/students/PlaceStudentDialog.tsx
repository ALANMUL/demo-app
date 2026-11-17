"use client";

import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { FormError } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { usePlaceStudent, type StudentDetail } from "@/lib/school/students";
import { SectionPicker, useSectionChoice, type SectionChoice } from "../SectionPicker";

/**
 * Puts a student who has no class this year (their class or section was deleted) into one.
 * The fees set up for that class are given to them, as on admission.
 */
export function PlaceStudentDialog({ student, open, onClose }: { student: StudentDetail; open: boolean; onClose: () => void }) {
  const t = useTranslations("deletes.place");
  const tType = useTranslations("school.students.admissionType");
  const tCommon = useTranslations("common");
  const describeError = useErrorMessage();
  const place = usePlaceStudent();
  const [choice, setChoice] = useState<SectionChoice>({});
  const [admissionType, setAdmissionType] = useState<"NEW" | "OLD">("OLD");
  const [error, setError] = useState<string | null>(null);
  const { chosenClass, sectionId } = useSectionChoice(choice);

  const close = () => {
    setError(null);
    onClose();
  };
  const submit = () => {
    if (!chosenClass) return;
    place.mutate(
      { studentId: student.id, body: { classId: chosenClass.id, ...(sectionId ? { sectionId } : {}), admissionType } },
      {
        onSuccess: () => {
          toast.success(t("done", { class: chosenClass.name }));
          close();
        },
        onError: (e) => setError(describeError(e)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !place.isPending && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <FormError message={error} />
        <div className="flex flex-wrap items-end gap-2">
          <SectionPicker choice={choice} onChange={setChoice} />
          <Select value={admissionType} onValueChange={(v) => setAdmissionType(v as "NEW" | "OLD")}>
            <SelectTrigger className="w-36" label={tType("label")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["OLD", "NEW"] as const).map((type) => (
                <SelectItem key={type} value={type}>
                  {tType(`types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={place.isPending}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={submit} disabled={place.isPending || !chosenClass}>
            <UserPlus /> {place.isPending ? t("working") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
