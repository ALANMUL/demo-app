import { ChevronRight, Mail, MapPin, Phone, School, type LucideIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { authRoutes, sessionFlagCookie } from "@/lib/auth/routes";
import { pickName } from "@/lib/i18n/names";
import { localPhone } from "@/lib/marketing/company";
import { siteChapters, SOCIAL_KEYS, type SchoolSite } from "@/lib/site";
import { SOCIAL_GLYPHS } from "./SocialGlyphs";

/*
 * The homepage's footer, on paper, in the school's accent: up to four columns parted by hairlines.
 *   - the school: its round logo, its name, and its line (its footer line, or the default one) in
 *     italic;
 *   - quick links: the homepage's chapters, then the login (or the app, once logged in);
 *   - contact: phone, email and address, each behind a small round mark in the accent's deep shade;
 *   - follow: the school's pages elsewhere (Facebook, YouTube, Instagram) as round marks, only
 *     those it filled in (no column without any).
 * The copyright line sits under them, over a soft wave in the accent's tint.
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
  const loggedIn = jar.has(sessionFlagCookie.SCHOOL);
  const links = [
    ...siteChapters(school).map((id) => ({ href: `#${id}`, label: tNav(id) })),
    loggedIn ? { href: authRoutes.SCHOOL.home, label: tHome("openApp") } : { href: authRoutes.SCHOOL.login, label: tHome("logIn") },
  ];
  const social = SOCIAL_KEYS.filter((key) => school.about[key]);
  const focus = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink";
  const column = "lg:border-l lg:border-border/70 lg:px-7 xl:px-9";

  return (
    <footer className="relative isolate overflow-hidden border-t border-border/70 bg-card text-foreground">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)_minmax(0,1.5fr)_auto] lg:gap-0">
          {/* the school */}
          <div className="lg:pr-7 xl:pr-9">
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-brand-ink shadow-[0_2px_10px_rgb(15_23_42/0.12)] ring-1 ring-brand-ink/10">
                {school.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- school logos can be on any host
                  <img src={school.logo} alt="" className="size-full object-contain" />
                ) : (
                  <School className="size-6" />
                )}
              </span>
              <span className="min-w-0 text-lg leading-tight font-bold text-navy text-balance">{name}</span>
            </div>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed whitespace-pre-line text-brand italic">{school.about.footerNote || t("about")}</p>
          </div>

          {/* quick links */}
          <nav aria-label={t("links")} className={column}>
            <Heading>{t("links")}</Heading>
            <ul className="space-y-1 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={`group inline-flex min-h-8 items-center gap-1.5 text-foreground/80 transition-colors hover:text-navy ${focus}`}>
                    <ChevronRight className="size-3.5 shrink-0 text-navy transition-transform group-hover:translate-x-0.5" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          {(school.phone || school.publicEmail || school.address) && (
            <div className={column}>
              <Heading>{t("contact")}</Heading>
              <ul className="space-y-3 text-sm text-foreground/80">
                {school.phone && (
                  <Contact icon={Phone}>
                    <a href={`tel:${school.phone}`} className={`tabular-nums hover:text-navy ${focus}`}>
                      {localPhone(school.phone)}
                    </a>
                  </Contact>
                )}
                {school.publicEmail && (
                  <Contact icon={Mail}>
                    <a href={`mailto:${school.publicEmail}`} className={`[overflow-wrap:anywhere] hover:text-navy ${focus}`}>
                      {school.publicEmail}
                    </a>
                  </Contact>
                )}
                {school.address && (
                  <Contact icon={MapPin}>
                    <span className="whitespace-pre-line">{school.address}</span>
                  </Contact>
                )}
              </ul>
            </div>
          )}

          {/* follow */}
          {social.length > 0 && (
            <div className={column}>
              <Heading>{t("follow")}</Heading>
              <ul className="flex gap-2.5">
                {social.map((key) => {
                  const Glyph = SOCIAL_GLYPHS[key];
                  return (
                    <li key={key}>
                      <a
                        href={school.about[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t(key)}
                        className="flex size-9 items-center justify-center rounded-full bg-brand-ink text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
                      >
                        <Glyph className="size-4.5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-12 text-xs text-muted-foreground">{t("rights", { year: new Date().getFullYear(), name })}</p>
      </div>

      {/* a soft wave in the accent's tint along the bottom right */}
      <svg
        aria-hidden
        viewBox="0 0 800 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-24 w-full text-brand sm:h-28 lg:w-[65%]"
      >
        <path d="M0 120 C 180 120 260 60 420 58 C 580 56 660 20 800 0 L 800 120 Z" fill="currentColor" opacity="0.07" />
        <path d="M120 120 C 300 118 380 82 520 80 C 650 78 720 52 800 36 L 800 120 Z" fill="currentColor" opacity="0.1" />
      </svg>
    </footer>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 text-base font-bold text-navy">{children}</h3>;
}

// one contact: its icon in a small round mark of the accent's deep shade, then the words
function Contact({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-ink text-white">
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 pt-1">{children}</span>
    </li>
  );
}
