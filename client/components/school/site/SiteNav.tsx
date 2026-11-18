"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { jumpToSection, useActiveSection } from "@/lib/useSectionNav";
import { cn } from "@/lib/utils";

// section "top" is the top of the homepage; the others are ids of its sections
export type SiteLink = { href: string; label: string; section: string };

// the ring every control on the white bar shows when reached by keyboard, in the school's colour
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-sidebar";

// the way in: an outline in the school's colour, so the hero keeps the page's only solid button
const accountButton =
  "inline-flex h-9 items-center rounded-md border border-school-sidebar/50 px-5 text-sm font-semibold text-school-sidebar transition-colors hover:bg-school-sidebar/8";

// বাংলা | English on the white bar: a quiet outline, the chosen language filled in the school's colour
const languageOnBar = cn(
  "border-school-sidebar/20 bg-transparent",
  "[&_button]:text-school-sidebar/75 [&_button:hover]:text-school-sidebar",
  "[&_button[aria-pressed=true]]:bg-school-sidebar [&_button[aria-pressed=true]]:text-white [&_button[aria-pressed=true]:hover]:text-white",
  "[&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-school-sidebar",
);

/*
 * The menu of the public header's white bar: from lg the chapters in a row at the bar's middle,
 * the language and the way in at its right end; below lg a button opens them as a panel under the bar. A link scrolls to its
 * chapter and the gold mark follows the chapter in view.
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
      <nav aria-label={labels.nav} className="hidden items-center justify-center gap-1 lg:flex">
        {links.map((link) => (
          <Link
            key={link.section}
            href={link.href}
            onClick={(e) => jump(e, link)}
            aria-current={active === link.section ? "location" : undefined}
            className={cn(
              "relative rounded-sm px-3.5 py-2 text-[17px] font-medium transition-colors after:absolute after:inset-x-3.5 after:-bottom-px after:h-0.5 after:rounded-full",
              focusRing,
              active === link.section
                ? "text-school-sidebar after:bg-sidebar-primary"
                : "text-school-sidebar/80 hover:text-school-sidebar hover:after:bg-school-sidebar/30",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 justify-self-end lg:flex">
        <LanguageSwitcher className={languageOnBar} />
        <Link
          href={account.href}
          className={cn(accountButton, focusRing)}
        >
          {account.label}
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? labels.close : labels.menu}
        className={cn("flex size-10 shrink-0 items-center justify-center rounded-md text-school-sidebar hover:bg-school-sidebar/8 lg:hidden", focusRing)}
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
                    ? "border-sidebar-primary text-school-sidebar"
                    : "border-transparent text-school-sidebar/80 hover:text-school-sidebar",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
            <LanguageSwitcher className={languageOnBar} />
            <Link
              href={account.href}
              className={cn(accountButton, focusRing)}
            >
              {account.label}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
