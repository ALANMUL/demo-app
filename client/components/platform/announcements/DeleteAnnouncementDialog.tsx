"use client";

import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useDeleteAnnouncement, type PlatformAnnouncement } from "@/lib/platform/announcements";

export function DeleteAnnouncementDialog({
  announcement,
  onClose,
}: {
  announcement: PlatformAnnouncement | null;
  onClose: () => void;
}) {
  const t = useTranslations("platform.announcements.deleteDialog");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const describeError = useErrorMessage();
  const remove = useDeleteAnnouncement();

  const title = announcement ? (locale === "bn" ? announcement.titleBn : announcement.titleEn) : "";

  const confirm = () => {
    if (!announcement) return;
    remove.mutate(announcement.id, {
      onSuccess: () => {
        toast.success(t("deleted"));
        onClose();
      },
      onError: (error) => toast.error(describeError(error)),
    });
  };

  return (
    <AlertDialog open={!!announcement} onOpenChange={(open) => !open && !remove.isPending && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { title })}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={remove.isPending}>{tCommon("cancel")}</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm} disabled={remove.isPending}>
            {remove.isPending ? t("deleting") : t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
