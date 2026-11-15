"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Variant = "list" | "dashboard";

/*
 * A page's outline while it loads, inside the menu and top bar: grey blocks where the title,
 * its button and the content will be. "list" (most pages): a toolbar and a table of rows.
 * "dashboard": the welcome banner, four figures and two panels.
 */
export function PageSkeleton({ variant = "list", className }: { variant?: Variant; className?: string }) {
  const t = useTranslations("common");
  return (
    <div role="status" aria-busy className={cn("space-y-5", className)}>
      <span className="sr-only">{t("loading")}</span>
      {variant === "dashboard" ? <DashboardBlocks /> : <ListBlocks />}
    </div>
  );
}

function ListBlocks() {
  return (
    <>
      {/* title and description, the page's main button */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-1 w-10 rounded-full" />
          <Skeleton className="h-8 w-56 max-w-[70vw]" />
          <Skeleton className="h-4 w-80 max-w-[80vw]" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* search and filters */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-full sm:w-64" />
        <Skeleton className="hidden h-9 w-36 sm:block" />
        <Skeleton className="hidden h-9 w-36 md:block" />
      </div>

      {/* the table: a header and rows */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex gap-4 border-b bg-muted/40 px-4 py-3">
          {[24, 40, 28, 20].map((w, i) => (
            <Skeleton key={i} className={cn("h-3.5", i > 1 && "hidden sm:block")} style={{ width: `${w}%` }} />
          ))}
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b px-4 py-3.5 last:border-b-0">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-[22%] sm:block" />
            <Skeleton className="hidden h-4 w-[16%] md:block" />
            <Skeleton className="size-6 shrink-0" />
          </div>
        ))}
      </div>
    </>
  );
}

function DashboardBlocks() {
  return (
    <>
      <Skeleton className="h-36 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[154px] rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </>
  );
}
