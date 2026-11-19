"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { jumpToSection, useActiveSection } from "@/lib/useSectionNav";
import { cn } from "@/lib/utils";

// section "top" is the top of the homepage; the others are ids of its sections
export type SiteLink = { href: string; label: string; section: string };

// the ring every control on the white bar shows when reached by keyboard, in the school's colour
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink";

/*
 * The menu of the public header's white bar: from lg the links in a row at the bar's right, the
 * one in view a pill in the school's accent with a short gold line under it; below lg a button
 * opens them as a panel under the bar, with the way in (the language and the portals are in the
 * thin bar above). A link scrolls to its chapter.
 */
export function SiteNav({
  links,
  account,
  labels,
}: {
  links: SiteLink[];
  account: { href: string; label: string };
  labels: { menu: string; close: string; nav: string };
}) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(links.map((link) => link.section));

  // Escape closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (e: MouseEvent, link: SiteLink) => {
    setOpen(false);
    jumpToSection(link.section, link.href, e);
  };

  return (
    <>
      <nav aria-label={labels.nav} className="ml-auto hidden items-center gap-1 lg:flex">
        {links.map((link) => {
          const current = active === link.section;
          return (
            <Link
              key={link.section}
              href={link.href}
              onClick={(e) => jump(e, link)}
              aria-current={current ? "location" : undefined}
              className={cn(
                "relative rounded-full px-4 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors",
                focusRing,
                current
                  ? // the pill, and a short gold line under it
                    "bg-brand-band text-brand-band-foreground after:absolute after:inset-x-4 after:-bottom-2.5 after:h-0.75 after:rounded-full after:bg-sidebar-primary"
                  : "text-brand-ink hover:bg-brand-ink/8",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? labels.close : labels.menu}
        className={cn("flex size-10 shrink-0 items-center justify-center rounded-md text-brand-ink hover:bg-brand-ink/8 lg:hidden", focusRing)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div id="site-menu" className="absolute inset-x-0 top-full border-y border-border bg-white shadow-lg lg:hidden">
          <nav aria-label={labels.nav} className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map((link) => (
              <Link
                key={link.section}
                href={link.href}
                onClick={(e) => jump(e, link)}
                aria-current={active === link.section ? "location" : undefined}
                className={cn(
                  "border-l-2 px-3 py-2.5 text-[17px] font-medium",
                  focusRing,
                  active === link.section
                    ? "border-sidebar-primary font-semibold text-brand-ink"
                    : "border-transparent text-brand-ink/80 hover:text-brand-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto flex max-w-6xl justify-end border-t border-border px-4 py-3">
            <Link
              href={account.href}
              className={cn(
                "inline-flex h-10 items-center rounded-full bg-brand-band px-6 text-sm font-semibold text-brand-band-foreground transition-opacity hover:opacity-90",
                focusRing,
              )}
            >
              {account.label}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
