"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { jumpToSection, useActiveSection } from "@/lib/useSectionNav";
import { cn } from "@/lib/utils";

// section "top" is the top of the homepage; the others are ids of its sections
export type SiteLink = { href: string; label: string; section: string };

// the gold ring every control on the coloured bar shows when reached by keyboard
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary";

// the way in: an outline on the bar, so the hero keeps the page's only solid white button
const accountButton = "inline-flex h-9 items-center rounded-md border border-white/60 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10";

// বাংলা | English on the coloured bar: white outline, the chosen language filled white
const languageOnBar = cn(
  "border-white/30 bg-transparent",
  "[&_button]:text-white/80 [&_button:hover]:text-white",
  "[&_button[aria-pressed=true]]:bg-white [&_button[aria-pressed=true]]:text-school-sidebar [&_button[aria-pressed=true]:hover]:text-school-sidebar",
  "[&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-sidebar-primary",
);

/*
 * The menu of the public header's coloured bar: from lg the chapters in a row at the bar's middle,
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
              active === link.section ? "text-white after:bg-sidebar-primary" : "text-white/85 hover:text-white hover:after:bg-white/40",
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
        className={cn("flex size-10 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden", focusRing)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div id="site-menu" className="absolute inset-x-0 top-full border-t border-white/10 bg-school-sidebar lg:hidden">
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
                  active === link.section ? "border-sidebar-primary text-white" : "border-transparent text-white/85 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
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
