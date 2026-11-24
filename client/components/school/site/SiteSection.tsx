import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SiteLabel } from "./SiteLabel";
import { siteContainer, siteHeading, siteScrollMargin } from "./siteStyles";

/*
 * One part of the homepage, as the mockup lays out Notices and Facilities: on white, 48px above and
 * below, its orange label over its heading at the left, with an action across from it ("View all
 * notices", arrows), then its content 28px under them.
 */
export function SiteSection({
  id,
  label,
  title,
  action,
  className,
  children,
}: {
  id: string;
  label: string;
  title: string;
  action?: ReactNode;
  // the band's own padding, when it isn't the usual 48px (Facilities: 40px)
  className?: string;
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn(siteScrollMargin, "bg-white py-12", className)}>
      <div className={siteContainer}>
        <SiteHeader label={label} title={title} headingId={headingId} action={action} />
        {children}
      </div>
    </section>
  );
}

/** The label, the heading and the action of a section, on their own (for a section that lays itself out). */
export function SiteHeader({ label, title, headingId, action }: { label: string; title: string; headingId: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <SiteLabel className="mb-1.5">{label}</SiteLabel>
        <h2 id={headingId} className={siteHeading}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
