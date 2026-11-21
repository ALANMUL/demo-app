import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * A chapter of the homepage, laid out like a page of a printed prospectus: a short gold line and
 * its title in the left margin (staying in view while the chapter scrolls by) and its content
 * beside them, a hairline above. On a phone the title sits above the content.
 */
export function Chapter({
  id,
  title,
  tone = "paper",
  children,
}: {
  id: string;
  title: string;
  // paper (white) or the grey desk, to set one chapter off from the next
  tone?: "paper" | "desk";
  children: ReactNode;
}) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-16 border-t border-border/70 sm:scroll-mt-22", tone === "paper" ? "bg-card" : "bg-canvas")}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <header className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <span aria-hidden className="mb-4 block h-0.75 w-12 rounded-full bg-sidebar-primary" />
            <h2 id={headingId} className="text-2xl leading-tight font-bold tracking-[-0.015em] text-balance text-navy sm:text-3xl lg:text-[1.75rem]">
              {title}
            </h2>
          </div>
        </header>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
