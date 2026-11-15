"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PageSkeleton } from "./PageSkeleton";

// a block on the navy menu: white at low strength, so it reads as a placeholder there too
const onMenu = "animate-pulse rounded-md bg-white/15 motion-reduce:animate-none";

/*
 * The whole dashboard's outline while the login is checked (before the real menu can be
 * drawn): the navy menu, the top bar and a page, at the sizes SidebarShell uses, so nothing
 * jumps when it arrives.
 */
export function ShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-58 shrink-0 flex-col bg-school-sidebar md:flex" aria-hidden>
        <div className="flex h-18 items-center gap-3 border-b border-white/20 px-5">
          <div className={cn(onMenu, "size-10 rounded-xl")} />
          <div className="flex-1 space-y-2">
            <div className={cn(onMenu, "h-4 w-24")} />
            <div className={cn(onMenu, "h-3 w-16")} />
          </div>
        </div>
        <div className="space-y-2 px-3 pt-4">
          <div className={cn(onMenu, "mb-4 ml-2 h-3 w-20")} />
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-1.5">
              <div className={cn(onMenu, "size-8 rounded-lg")} />
              <div className={cn(onMenu, "h-3.5")} style={{ width: `${55 + ((i * 17) % 35)}%` }} />
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-18 shrink-0 items-center gap-3 border-b bg-background/90 px-3 md:px-4 lg:px-5" aria-hidden>
          <Skeleton className="size-9 md:hidden" />
          <Skeleton className="h-6 w-48 max-w-[50vw]" />
          <div className="ml-auto flex items-center gap-3">
            <Skeleton className="hidden size-9 rounded-full sm:block" />
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </header>
        <main className="flex-1 p-3 md:p-4 lg:p-5">
          <Skeleton className="mb-3 h-3 w-28" aria-hidden />
          <PageSkeleton />
        </main>
      </div>
    </div>
  );
}
