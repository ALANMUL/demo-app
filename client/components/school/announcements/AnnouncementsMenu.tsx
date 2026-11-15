"use client";

import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { topBarIconButton } from "@/components/layout/topBar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnnouncements,
  useAnnouncementUnreadCount,
  useMarkAllAnnouncementsRead,
  useMarkAnnouncementRead,
  type SchoolAnnouncement,
} from "@/lib/school/announcements";
import { cn } from "@/lib/utils";
import { AnnouncementItem } from "./AnnouncementItem";

const RECENT = 6;
const PAGE_HREF = "/announcements";

/** The super admin's bell: the platform's announcements, the unread count and the newest when opened. */
export function AnnouncementsMenu() {
  const t = useTranslations("announcements");
  const format = useFormatter();
  const router = useRouter();
  const unread = useAnnouncementUnreadCount();
  const [open, setOpen] = useState(false);
  // the list loads when the menu is first opened
  const recent = useAnnouncements({ limit: RECENT }, open);
  const markRead = useMarkAnnouncementRead();
  const markAll = useMarkAllAnnouncementsRead();

  const openAnnouncement = (announcement: SchoolAnnouncement) => {
    if (!announcement.read) markRead.mutate(announcement.id);
    router.push(PAGE_HREF);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(topBarIconButton, "relative rounded-full")}
          aria-label={unread > 0 ? `${t("title")} (${t("unreadCount", { count: unread })})` : t("title")}
        >
          <Bell className="size-4.5" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[12px] leading-none font-semibold text-white tabular-nums ring-2 ring-background">
              {unread > 99 ? "99+" : format.number(unread)}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-[min(24rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("title")}</span>
            {unread > 0 && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {t("unreadCount", { count: unread })}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate(undefined)}
              disabled={markAll.isPending}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <CheckCheck className="size-3.5" /> {t("markAllRead")}
            </button>
          )}
        </div>

        <div className="max-h-[min(26rem,60vh)] overflow-y-auto p-1">
          {recent.isPending ? (
            Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-3 px-3 py-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : recent.isError ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">{t("loadFailed")}</p>
          ) : recent.data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-muted-foreground">
              <BellOff className="size-8 text-muted-foreground/50" />
              {t("empty")}
            </div>
          ) : (
            recent.data.items.map((announcement) => (
              <DropdownMenuItem
                key={announcement.id}
                onSelect={() => openAnnouncement(announcement)}
                className="rounded-md px-3 py-2.5 focus:bg-brand-soft/60 data-[highlighted]:bg-brand-soft/60"
              >
                <AnnouncementItem announcement={announcement} compact />
              </DropdownMenuItem>
            ))
          )}
        </div>

        <div className="border-t p-1">
          <DropdownMenuItem asChild className="justify-center py-2 text-sm font-medium text-navy">
            <Link href={PAGE_HREF}>{t("viewAll")}</Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
