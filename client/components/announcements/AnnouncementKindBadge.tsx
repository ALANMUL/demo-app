"use client";

import type { LucideIcon } from "lucide-react";
import { RefreshCw, Sparkles, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AnnouncementKind } from "@/lib/platform/announcements";
import { cn } from "@/lib/utils";

// Shared by the platform's announcement list and the school's bell and page.

// each kind: its icon and colour (the words carry the meaning, the colour only helps)
export const ANNOUNCEMENT_KIND_STYLE: Record<AnnouncementKind, { icon: LucideIcon; tone: string }> = {
  NEW_FEATURE: { icon: Sparkles, tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" },
  CHANGE: { icon: RefreshCw, tone: "bg-brand-soft text-brand" },
  MAINTENANCE: { icon: Wrench, tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" },
};

/** A small chip: "New feature", "Change" or "Maintenance". */
export function AnnouncementKindBadge({ kind, className }: { kind: AnnouncementKind; className?: string }) {
  const t = useTranslations("announcements.kinds");
  const { icon: Icon, tone } = ANNOUNCEMENT_KIND_STYLE[kind];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", tone, className)}>
      <Icon className="size-3" />
      {t(kind)}
    </span>
  );
}
