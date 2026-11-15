import { School } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { pickName } from "@/lib/i18n/names";
import { siteChapters, type SchoolSite } from "@/lib/site";

/*
 * The homepage's footer, in the school's colour: who it is, in its own words (its footer line, or
 * the default one), and its chapters. The contacts are in the chapter just above, so they aren't
 * repeated here.
 */
export async function SiteFooter({ school }: { school: SchoolSite }) {
  const [t, tNav, locale] = await Promise.all([getTranslations("schoolHome.footer"), getTranslations("schoolHome.nav"), getLocale()]);
  const name = pickName(school, locale);
  const links = siteChapters(school).map((id) => ({ href: `#${id}`, label: tNav(id) }));
  const link = "rounded-sm text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary";

  return (
    // "dark" so the gold takes the menu's own gold
    <footer className="dark bg-school-sidebar text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-school-sidebar">
              {school.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- school logos can be on any host
                <img src={school.logo} alt="" className="size-11 object-contain" />
              ) : (
                <School className="size-6" />
              )}
            </span>
            <span className="min-w-0 text-lg leading-tight font-bold">{name}</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed whitespace-pre-line text-white/70">{school.about.footerNote || t("about")}</p>
        </div>

        <nav aria-label={t("links")}>
          <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold text-white">
            <span aria-hidden className="h-0.75 w-6 bg-sidebar-primary" />
            {t("links")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/60">{t("rights", { year: new Date().getFullYear(), name })}</p>
      </div>
    </footer>
  );
}
