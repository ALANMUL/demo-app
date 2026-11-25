import { ChevronRight, Globe, Mail, MapPin, Phone, School, type LucideIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { authRoutes, publicSchoolRoutes, sessionFlagCookie } from "@/lib/auth/routes";
import { pickName } from "@/lib/i18n/names";
import { localPhone } from "@/lib/marketing/company";
import { siteChapters, SOCIAL_KEYS, type SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SOCIAL_GLYPHS } from "./SocialGlyphs";
import { siteContainer, siteFocus, siteScrollMargin, splitName } from "./siteStyles";

/*
 * The homepage's footer, as in the mockup, and the place the menu's "Contact" goes to: on white,
 * a hairline above, in four columns from 1024px (each as wide as its content, with the same space
 * between any two; two from 640px, stacked on phones), their lists in rows of the same height:
 *   - the school: its 64px round logo, its name over two lines in the deep accent, and its line
 *     (its footer line, or the default one) in italic;
 *   - quick links: the homepage's parts, then the login (or the dashboard, once logged in);
 *   - contact us: phone, email, address (opening Google Maps) and website, each after a small icon;
 *   - follow us: the school's pages elsewhere as round marks in the deep accent (gold on hover),
 *     only those it filled in.
 * Under them, over a soft wave in the pale tint with a gold stroke, the copyright line.
 */
export async function SiteFooter({ school }: { school: SchoolSite }) {
  const [t, tNav, tHome, locale, jar] = await Promise.all([
    getTranslations("schoolHome.footer"),
    getTranslations("schoolHome.nav"),
    getTranslations("schoolHome"),
    getLocale(),
    cookies(),
  ]);
  const name = pickName(school, locale);
  const [first, second] = splitName(name);
  const loggedIn = jar.has(sessionFlagCookie.SCHOOL);
  const links = [
    // the homepage's parts, from any page of the site (the application form too); not this one
    ...siteChapters(school)
      .filter((id) => id !== "contact")
      .map((id) => ({ href: `${publicSchoolRoutes.home}#${id}`, label: tNav(id) })),
    loggedIn ? { href: authRoutes.SCHOOL.home, label: tHome("dashboard") } : { href: authRoutes.SCHOOL.login, label: tHome("logIn") },
  ];
  const social = SOCIAL_KEYS.filter((key) => school.about[key]);
  const mapHref = school.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address.replace(/\s*\n\s*/g, ", "))}`
    : null;

  return (
    <footer id="contact" aria-label={t("contact")} className={cn(siteScrollMargin, "relative overflow-hidden border-t border-slate-100 bg-white pt-14")}>
      <div className={cn(siteContainer, "relative z-10 pb-12")}>
        {/* from 1024px: each column as wide as its content (the school at most 352px, its line wraps), the
            space left over shared out evenly, so the white between any two columns is the same */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:justify-between lg:gap-12">
          {/* the school */}
          <div className="space-y-4 lg:max-w-88">
            <div className="flex items-center gap-3.5">
              <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-brand-ink">
                {school.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- school logos can be on any host
                  <img src={school.logo} alt="" className="size-full object-contain" />
                ) : (
                  <School className="size-7" />
                )}
              </span>
              <span className="site-serif min-w-0 font-bold text-brand-ink">
                <span className="block text-base leading-tight">{first}</span>
                {second && <span className="block text-sm leading-tight">{second}</span>}
              </span>
            </div>
            <p className="site-serif text-sm whitespace-pre-line text-brand-ink/80 italic">{school.about.footerNote || t("about")}</p>
          </div>

          {/* quick links */}
          <nav aria-label={t("links")}>
            <Heading>{t("links")}</Heading>
            {/* the same 20px rows, 10px apart, as the contacts beside them, so the two lists line up */}
            <ul className="space-y-2.5 text-xs font-medium text-slate-600">
              {links.map((l) => (
                <li key={l.href} className="flex min-h-5 items-center">
                  <a href={l.href} className={cn("flex items-center gap-2.5 rounded-sm leading-5 hover:text-brand-ink", siteFocus)}>
                    <ChevronRight aria-hidden className="size-3.5 shrink-0 text-brand-ink" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact us */}
          <div>
            <Heading>{t("contact")}</Heading>
            {school.phone || school.publicEmail || school.address || school.website ? (
              <ul className="space-y-2.5 text-xs font-medium text-slate-600">
                {school.phone && (
                  <Contact icon={Phone}>
                    <a href={`tel:${school.phone}`} className={cn("rounded-sm tabular-nums hover:text-brand-ink", siteFocus)}>
                      {localPhone(school.phone)}
                    </a>
                  </Contact>
                )}
                {school.publicEmail && (
                  <Contact icon={Mail}>
                    <a href={`mailto:${school.publicEmail}`} className={cn("rounded-sm [overflow-wrap:anywhere] hover:text-brand-ink", siteFocus)}>
                      {school.publicEmail}
                    </a>
                  </Contact>
                )}
                {school.address && mapHref && (
                  <Contact icon={MapPin}>
                    <a href={mapHref} target="_blank" rel="noreferrer" className={cn("rounded-sm whitespace-pre-line hover:text-brand-ink", siteFocus)}>
                      {school.address}
                    </a>
                  </Contact>
                )}
                {school.website && (
                  <Contact icon={Globe}>
                    <a href={school.website} target="_blank" rel="noreferrer" className={cn("rounded-sm [overflow-wrap:anywhere] hover:text-brand-ink", siteFocus)}>
                      {school.website.replace(/^https?:\/\//, "")}
                    </a>
                  </Contact>
                )}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">{tHome("contact.none")}</p>
            )}
          </div>

          {/* follow us */}
          {social.length > 0 && (
            <div>
              <Heading>{t("follow")}</Heading>
              <ul className="flex items-center gap-2.5">
                {social.map((key) => {
                  const Glyph = SOCIAL_GLYPHS[key];
                  return (
                    <li key={key}>
                      <a
                        href={school.about[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t(key)}
                        className={cn("flex size-8 items-center justify-center rounded-full bg-brand-ink text-white transition hover:bg-site-gold", siteFocus)}
                      >
                        <Glyph className="size-3.5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* a soft wave in the pale tint with a gold stroke, and the copyright line over it */}
      <div className="relative border-t border-slate-100 pt-6 pb-5">
        <svg
          aria-hidden
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute right-0 bottom-0 h-28 w-full opacity-60"
        >
          <path d="M500,120 C850,40 1150,90 1440,10 L1440,120 Z" fill="var(--color-site-line)" />
          <path d="M900,120 C1120,70 1280,50 1440,0" stroke="var(--color-site-gold)" strokeWidth="5" fill="none" />
        </svg>
        <div className={cn(siteContainer, "relative z-10")}>
          <p className="text-[11px] text-slate-600">{t("rights", { year: new Date().getFullYear(), name })}</p>
        </div>
      </div>
    </footer>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 text-sm font-bold text-brand-ink">{children}</h2>;
}

// one contact: a small icon in the deep accent, then the words
function Contact({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <li className="flex min-h-5 items-start gap-2.5 leading-5">
      <Icon aria-hidden className="mt-[3px] size-3.5 shrink-0 text-brand-ink" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}
