"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/auth/formErrors";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import {
  ANNOUNCEMENT_KINDS,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  type PlatformAnnouncement,
} from "@/lib/platform/announcements";
import { announcementFormSchema, type AnnouncementFormInput, type AnnouncementFormValues } from "@/zod/announcement";

type Props = {
  open: boolean;
  // null: writing a new announcement
  announcement: PlatformAnnouncement | null;
  onClose: () => void;
};

export function AnnouncementFormDialog({ open, announcement, onClose }: Props) {
  const t = useTranslations("platform.announcements.form");
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{announcement ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>{announcement ? t("editNote") : t("addNote")}</DialogDescription>
        </DialogHeader>
        {/* remounted per announcement so the fields start from it */}
        {open && <AnnouncementForm key={announcement?.id ?? "new"} announcement={announcement} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

const FIELDS: FieldPath<AnnouncementFormInput>[] = ["kind", "titleEn", "titleBn", "bodyEn", "bodyBn"];

function AnnouncementForm({ announcement, onDone }: { announcement: PlatformAnnouncement | null; onDone: () => void }) {
  const t = useTranslations("platform.announcements.form");
  const tKind = useTranslations("announcements.kinds");
  const tCommon = useTranslations("common");
  const describeError = useErrorMessage();
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement();
  const [formError, setFormError] = useState<string | null>(null);
  const saving = create.isPending || update.isPending;

  const form = useForm<AnnouncementFormInput, unknown, AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      kind: announcement?.kind ?? "NEW_FEATURE",
      titleEn: announcement?.titleEn ?? "",
      titleBn: announcement?.titleBn ?? "",
      bodyEn: announcement?.bodyEn ?? "",
      bodyBn: announcement?.bodyBn ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      if (announcement) await update.mutateAsync({ announcementId: announcement.id, body: values });
      else await create.mutateAsync(values);
      toast.success(t(announcement ? "updated" : "created"));
      onDone();
    } catch (error) {
      setFormError(applyServerErrors(error, form.setError, FIELDS, describeError));
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormError message={formError} />

        <FormField
          control={form.control}
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t("kind")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ANNOUNCEMENT_KINDS.map((kind) => (
                    <SelectItem key={kind} value={kind}>
                      {tKind(kind)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("titleEn")}</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="titleBn"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("titleBn")}</FormLabel>
                <FormControl>
                  <Input lang="bn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="bodyEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("bodyEn")}</FormLabel>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bodyBn"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t("bodyBn")}</FormLabel>
                <FormControl>
                  <Textarea lang="bn" rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onDone} disabled={saving}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? t("saving") : t(announcement ? "update" : "save")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
