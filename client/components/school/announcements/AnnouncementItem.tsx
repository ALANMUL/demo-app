"use client";

import { useFormatter, useLocale, useNow, useTranslations } from "next-intl";
import { ANNOUNCEMENT_KIND_STYLE, AnnouncementKindBadge } from "@/components/announcements/AnnouncementKindBadge";
import type { SchoolAnnouncement } from "@/lib/school/announcements";
import { cn } from "@/lib/utils";

// Shared by the top bar's bell and the notifications page.

/** An announcement's title and text in the current language. */
export const useAnnouncementText = () => {
  const locale = useLocale();
  return (a: SchoolAnnouncement) => (locale === "bn" ? { title: a.titleBn, body: a.bodyBn } : { title: a.titleEn, body: a.bodyEn });
};

/** One announcement: its kind, title, text and how long ago; unread ones marked. */
export function AnnouncementItem({ announcement, compact }: { announcement: SchoolAnnouncement; compact?: boolean }) {
  const t = useTranslations("announcements");
  const text = useAnnouncementText()(announcement);
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const { icon: Icon, tone } = ANNOUNCEMENT_KIND_STYLE[announcement.kind];
  const created = new Date(announcement.createdAt);

  return (
    <div className="flex w-full items-start gap-3 text-left">
      <span className={cn("flex shrink-0 items-center justify-center rounded-full", compact ? "size-9" : "size-10", tone)}>
        <Icon className={compact ? "size-4" : "size-[18px]"} />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("min-w-0 flex-1 text-sm", compact && "truncate", announcement.read ? "font-medium" : "font-semibold")}>
            {text.title}
          </span>
          <time
            dateTime={announcement.createdAt}
            className="shrink-0 text-xs text-muted-foreground"
            title={format.dateTime(created, { dateStyle: "medium", timeStyle: "short" })}
          >
            {format.relativeTime(created, now)}
          </time>
        </div>
        {!compact && <AnnouncementKindBadge kind={announcement.kind} />}
        <p className={cn("text-sm text-muted-foreground", compact ? "line-clamp-2" : "whitespace-pre-line")}>{text.body}</p>
      </div>
      {!announcement.read && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-600 dark:bg-red-500">
          <span className="sr-only">{t("new")}</span>
        </span>
      )}
    </div>
  );
}
