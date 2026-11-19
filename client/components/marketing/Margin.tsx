import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * The homepage is built like a school exercise book: a margin line runs down it, with short notes
 * in the margin (a time of day, a section's name) and the content to its right. Each section is
 * its own material (khata paper, a chalkboard, a notice, navy) and sets the line's colour in
 * --mk-line (red on paper). Rows sit one under another with no gap, so the line stays unbroken.
 * Below lg the margin folds away: the note sits above the content, still right of the line.
 */

/** The page's width, shared by the header and the footer so everything lines up with the margin. */
export const PAGE = "mx-auto w-full max-w-[76rem] px-4 sm:px-6";

export function MarginRow({
  note,
  children,
  className,
  noteClassName,
  rowClassName,
}: {
  note?: ReactNode;
  children?: ReactNode;
  className?: string;
  noteClassName?: string;
  // the row itself (the margin and the content together), e.g. to let it grow
  rowClassName?: string;
}) {
  return (
    <div className={cn(PAGE, "grid lg:grid-cols-[9.5rem_minmax(0,1fr)]", rowClassName)}>
      <div
        className={cn(
          "border-[color:var(--mk-line)] max-lg:border-l max-lg:pl-5 sm:max-lg:pl-8 lg:pr-6 lg:text-right",
          !note && "max-lg:hidden",
          noteClassName,
        )}
      >
        {note}
      </div>
      <div className={cn("min-w-0 border-l border-[color:var(--mk-line)] pl-5 sm:pl-8 lg:pl-12", className)}>{children}</div>
    </div>
  );
}

/** A section's heading, to the right of the line: the title and a line under it (light on the dark sections). */
export function MarginHeading({ id, title, subtitle, light }: { id?: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <h2 id={id} className={cn("mk-display text-[2.25rem] sm:text-[2.875rem]", light ? "text-white" : "text-mk-ink")}>
        {title}
      </h2>
      {subtitle && <p className={cn("mt-5 max-w-2xl text-lg leading-[1.65]", light ? "text-white/75" : "text-mk-slate")}>{subtitle}</p>}
    </div>
  );
}

/** A margin note: small italic words against the line. */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mk-note text-[15px] leading-snug text-mk-slate", className)}>{children}</p>;
}
