import { getFormatter } from "next-intl/server";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * A chapter of the homepage, laid out like a page of a printed prospectus: its number and title in
 * the left margin (staying in view while the chapter scrolls by) and its content beside them, a
 * hairline above. On a phone the number and title sit above the content. Numbers count only the
 * chapters the school has filled in, so they always run 01, 02, 03…, in the page's digits.
 */
export async function Chapter({
  id,
  number,
  title,
  tone = "paper",
  children,
}: {
  id: string;
  number: number;
  title: string;
  // paper (white) or the grey desk, to set one chapter off from the next
  tone?: "paper" | "desk";
  children: ReactNode;
}) {
  const format = await getFormatter();
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-16 border-t border-border/70 sm:scroll-mt-18", tone === "paper" ? "bg-card" : "bg-canvas")}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <header className="lg:col-span-3">
          <div className="flex items-baseline gap-4 lg:sticky lg:top-28 lg:block">
            <span aria-hidden className="text-[2.75rem] leading-none font-normal tracking-[-0.03em] text-navy tabular-nums lg:text-[4rem]">
              {format.number(number, { minimumIntegerDigits: 2 })}
            </span>
            <div className="min-w-0 lg:mt-5">
              <span aria-hidden className="mb-4 hidden h-px w-12 bg-border lg:block" />
              <h2 id={headingId} className="text-2xl leading-tight font-bold tracking-[-0.015em] text-balance sm:text-3xl lg:text-2xl">
                {title}
              </h2>
            </div>
          </div>
        </header>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
