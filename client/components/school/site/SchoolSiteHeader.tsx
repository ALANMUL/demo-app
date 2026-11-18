import { School } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { authRoutes, publicSchoolRoutes, sessionFlagCookie } from "@/lib/auth/routes";
import { pickName } from "@/lib/i18n/names";
import { siteChapters, type SchoolSite } from "@/lib/site";
import { SiteNav, type SiteLink } from "./SiteNav";

/*
 * The header of the school's public homepage: a white bar with its logo and name in the school's
 * own colour, the menu and the way in, staying at the top while the page scrolls. The menu items are
 * the homepage's chapters (those with something in them), in page order, and scroll to them.
 */
export async function SchoolSiteHeader({ school }: { school: SchoolSite }) {
  const [t, locale, jar] = await Promise.all([getTranslations("schoolHome"), getLocale(), cookies()]);
  const name = pickName(school, locale);
  const loggedIn = jar.has(sessionFlagCookie.SCHOOL);

  // the logo goes home; the menu holds the chapters
  const links: SiteLink[] = siteChapters(school).map((id) => ({ href: `${publicSchoolRoutes.home}#${id}`, label: t(`nav.${id}`), section: id }));

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border bg-white text-school-sidebar">
      {/* from lg three columns, the outer two equal, so the menu sits at the bar's true middle */}
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-18 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
        <Link
          href={publicSchoolRoutes.home}
          className="flex min-w-0 flex-1 items-center gap-3 justify-self-start rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-school-sidebar"
        >
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-school-sidebar">
            {school.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- school logos can be on any host
              <img src={school.logo} alt="" className="size-9 object-contain" />
            ) : (
              <School className="size-5" />
            )}
          </span>
          <span className="truncate text-[17px] font-bold tracking-[-0.01em] sm:text-lg">{name}</span>
        </Link>
        <SiteNav
          links={links}
          account={{ href: loggedIn ? authRoutes.SCHOOL.home : authRoutes.SCHOOL.login, label: loggedIn ? t("openApp") : t("logIn") }}
          labels={{ menu: t("nav.menu"), close: t("nav.closeMenu"), nav: t("nav.label") }}
        />
      </div>
    </header>
  );
}
