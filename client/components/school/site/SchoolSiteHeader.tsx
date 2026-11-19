import { LogIn, Mail, MapPin, Phone, School } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { authRoutes, publicSchoolRoutes, sessionFlagCookie } from "@/lib/auth/routes";
import { pickName } from "@/lib/i18n/names";
import { localPhone } from "@/lib/marketing/company";
import { siteChapters, type SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SiteLanguageMenu } from "./SiteLanguageMenu";
import { SiteNav, type SiteLink } from "./SiteNav";

/*
 * The header of the school's public homepage, in two parts:
 * - a thin bar of contacts (phone, email, address) with the way in (the login) and the language,
 *   which scrolls away with the page;
 * - the white bar under it with the school's round logo, its name over two lines in the deep shade
 *   of its accent (--brand-ink, the same in dark mode: the bar stays white), and the menu (Home, then the homepage's chapters, in page order), which stays at the top.
 * Its heights (36px + 64px on a phone, 40px + 88px from 640px) are what the hero and the chapters'
 * scroll margins allow for.
 */
export async function SchoolSiteHeader({ school }: { school: SchoolSite }) {
  const [t, locale, jar] = await Promise.all([getTranslations("schoolHome"), getLocale(), cookies()]);
  const name = pickName(school, locale);
  const loggedIn = jar.has(sessionFlagCookie.SCHOOL);
  const address = school.address?.split("\n")[0];

  // the logo goes home; the menu starts with Home, then the chapters
  const links: SiteLink[] = [
    { href: publicSchoolRoutes.home, label: t("nav.home"), section: "top" },
    ...siteChapters(school).map((id) => ({ href: `${publicSchoolRoutes.home}#${id}`, label: t(`nav.${id}`), section: id })),
  ];
  const login = authRoutes.SCHOOL.login;

  return (
    <>
      {/* the contacts and the ways in: a thin bar that scrolls away */}
      <div className="no-print border-b border-border/70 bg-white text-brand-ink">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 text-[13px] sm:h-10 sm:text-sm">
          <ul className="flex min-w-0 items-center">
            {school.phone && (
              <Contact icon={<Phone className="size-3.5" />}>
                <a href={`tel:${school.phone}`} className="tabular-nums hover:underline">
                  {localPhone(school.phone)}
                </a>
              </Contact>
            )}
            {school.publicEmail && (
              <Contact icon={<Mail className="size-3.5" />} className="hidden md:flex">
                <a href={`mailto:${school.publicEmail}`} className="hover:underline">
                  {school.publicEmail}
                </a>
              </Contact>
            )}
            {address && (
              // a long address is the one contact that shortens
              <Contact icon={<MapPin className="size-3.5" />} className="hidden min-w-0 shrink lg:flex">
                <span className="truncate">{address}</span>
              </Contact>
            )}
          </ul>

          <div className="flex shrink-0 items-center gap-4">
            {/* the way in: the school's one login (staff, students and guardians), or the app once in */}
            <Link
              href={loggedIn ? authRoutes.SCHOOL.home : login}
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
            >
              <LogIn className="size-3.5" />
              {loggedIn ? t("openApp") : t("logIn")}
            </Link>
            <SiteLanguageMenu />
          </div>
        </div>
      </div>

      {/* the school and its menu: stays at the top */}
      <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-white/95 text-brand-ink backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-22">
          <Link
            href={publicSchoolRoutes.home}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ink sm:gap-4 lg:flex-none"
          >
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-brand-ink shadow-[0_2px_10px_rgb(15_23_42/0.12)] ring-1 ring-brand-ink/10 sm:size-16">
              {school.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- school logos can be on any host
                <img src={school.logo} alt="" className="size-full object-contain" />
              ) : (
                <School className="size-6" />
              )}
            </span>
            {/* the name over (at most) two lines, as on the school's own board */}
            <span className="line-clamp-2 max-w-[17rem] text-[17px] leading-[1.15] font-bold tracking-[-0.01em] text-balance sm:text-[22px] lg:text-[24px]">
              {name}
            </span>
          </Link>
          <SiteNav
            links={links}
            account={{ href: loggedIn ? authRoutes.SCHOOL.home : login, label: loggedIn ? t("openApp") : t("logIn") }}
            labels={{ menu: t("nav.menu"), close: t("nav.closeMenu"), nav: t("nav.label") }}
          />
        </div>
      </header>
    </>
  );
}

// one contact in the thin bar: an icon and its text, a short line before every one but the first
function Contact({ icon, className, children }: { icon: ReactNode; className?: string; children: ReactNode }) {
  return (
    <li
      className={cn(
        // whole, unless told to shorten (the address); the line before it never shrinks
        "flex shrink-0 items-center gap-2 [&+&]:before:mx-4 [&+&]:before:h-3.5 [&+&]:before:w-px [&+&]:before:shrink-0 [&+&]:before:bg-brand-ink/30",
        className,
      )}
    >
      <span className="shrink-0 opacity-80">{icon}</span>
      {children}
    </li>
  );
}
