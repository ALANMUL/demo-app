"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { jumpToSection, useActiveSection } from "@/lib/useSectionNav";
import { cn } from "@/lib/utils";
import { siteContainer, siteFocus } from "./siteStyles";

// section "top" is the top of the homepage; the others are ids of its sections. A link with
// children opens them in a small menu (About: the school, its teachers)
export type SiteLink = { href: string; label: string; section: string; children?: SiteLink[] };

/*
 * The menu of the header's white bar, as in the mockup: from 1024px the links in a row at its right
 * (14px semibold in the school's deep accent, turning gold on hover), the one in view a box filled
 * with the deep accent in white with 6px corners; every item carries a small down arrow (one with
 * children opens them). In the phone panel each row ends in a small right arrow. Below 1024px a button opens them as a panel under the bar, with the way in. On the
 * homepage a link scrolls to its section; on another page of the site it goes to the homepage's.
 */
export function SiteNav({
  links,
  account,
  labels,
  onHome = true,
}: {
  links: SiteLink[];
  account: { href: string; label: string };
  labels: { menu: string; close: string; nav: string };
  // on the homepage the links scroll to its sections and the one in view is marked; on another
  // page of the site (the application form) they simply go to the homepage's sections
  onHome?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const all = links.flatMap((link) => [link, ...(link.children ?? [])]);
  const inView = useActiveSection([...new Set(all.map((link) => link.section))]);
  const active = onHome ? inView : null;
  const isCurrent = (link: SiteLink) => active === link.section || !!link.children?.some((child) => child.section === active);

  // Escape closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = (e: MouseEvent, link: SiteLink) => {
    setOpen(false);
    if (onHome) jumpToSection(link.section, link.href, e);
  };

  const item = (current: boolean) =>
    cn(
      // a little tighter from 1024px to 1280px, so the school's name keeps its room beside a full menu
      "flex items-center gap-1 rounded-[6px] px-2.5 py-2 whitespace-nowrap transition xl:px-3.5",
      siteFocus,
      current ? "bg-brand-ink text-white shadow-sm" : "hover:text-site-gold",
    );

  return (
    <>
      <nav aria-label={labels.nav} className="hidden items-center gap-1 text-sm font-semibold text-brand-ink lg:flex">
        {links.map((link) =>
          link.children ? (
            <DropdownMenu key={link.section} modal={false}>
              <DropdownMenuTrigger className={item(isCurrent(link))}>
                {link.label}
                <ChevronDown aria-hidden className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-44">
                {link.children.map((child) => (
                  <DropdownMenuItem key={child.section} asChild className="font-semibold text-brand-ink">
                    <Link href={child.href} onClick={(e) => jump(e, child)}>
                      {child.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              key={link.section}
              href={link.href}
              onClick={(e) => jump(e, link)}
              aria-current={active === link.section ? "location" : undefined}
              className={item(active === link.section)}
            >
              {link.label}
              {/* every item carries the small arrow, as the ones that open a menu do */}
              <ChevronDown aria-hidden className="size-3" />
            </Link>
          ),
        )}
      </nav>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? labels.close : labels.menu}
        className={cn("rounded-[6px] p-2 text-brand-ink hover:bg-site-ice lg:hidden", siteFocus)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div id="site-menu" className="absolute inset-x-0 top-full border-t border-slate-100 bg-white shadow-lg lg:hidden">
          <nav aria-label={labels.nav} className={cn(siteContainer, "space-y-2 pt-2 pb-4 text-sm font-semibold text-brand-ink")}>
            {all
              .filter((link) => !link.children)
              .map((link) => (
                <Link
                  key={link.section}
                  href={link.href}
                  onClick={(e) => jump(e, link)}
                  aria-current={active === link.section ? "location" : undefined}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[6px] px-3 py-2",
                    siteFocus,
                    active === link.section ? "bg-brand-ink text-white" : "hover:bg-site-ice",
                  )}
                >
                  {link.label}
                  <ChevronRight aria-hidden className="size-3.5 shrink-0" />
                </Link>
              ))}
            <Link href={account.href} className={cn("flex items-center justify-between gap-3 rounded-[6px] px-3 py-2 hover:bg-site-ice", siteFocus)}>
              {account.label}
              <ChevronRight aria-hidden className="size-3.5 shrink-0" />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
