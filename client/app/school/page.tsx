import { ArrowRight, ArrowUpRight, Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutSection } from "@/components/school/site/AboutSection";
import { AdmissionSection } from "@/components/school/site/AdmissionSection";
import { Chapter } from "@/components/school/site/Chapter";
import { GallerySection } from "@/components/school/site/GallerySection";
import { HeroSection } from "@/components/school/site/HeroSection";
import { NoticesSection } from "@/components/school/site/NoticesSection";
import { SchoolSiteHeader } from "@/components/school/site/SchoolSiteHeader";
import { SiteFooter } from "@/components/school/site/SiteFooter";
import { pickName } from "@/lib/i18n/names";
import { siteChapters } from "@/lib/site";
import { getCurrentSchoolSite } from "@/lib/site.server";

export async function generateMetadata(): Promise<Metadata> {
  const [school, locale] = await Promise.all([getCurrentSchoolSite(), getLocale()]);
  return school ? { title: pickName(school, locale) } : {};
}

// "+8801712345678" -> "01712345678", how people here write it
const localPhone = (phone: string) => phone.replace(/^\+?880/, "0");

type ContactRow = { icon: LucideIcon; label: string; value: string; action?: { href: string; label: string; external?: boolean } };

/**
 * A school's public homepage (no login), its only page, laid out like a printed prospectus: the
 * header, the photos with the school's name over them and the newest notice under them, then a
 * numbered chapter per menu item (about, admission, notices, gallery, contact; those the school
 * left empty are skipped and the rest keep counting) and the footer. The menu scrolls to them.
 */
export default async function SchoolHomePage() {
  const [t, locale, school] = await Promise.all([getTranslations("schoolHome"), getLocale(), getCurrentSchoolSite()]);
  // the school layout has already 404'd an unknown or inactive school
  if (!school) return null;
  // the name in the language being read (the other one only when this one is missing)
  const name = pickName(school, locale);

  // each chapter's number, counting only those shown
  const chapters = siteChapters(school);
  const numberOf = (id: (typeof chapters)[number]) => chapters.indexOf(id) + 1;

  const contacts = [
    school.phone && {
      icon: Phone,
      label: t("contact.phone"),
      value: localPhone(school.phone),
      action: { href: `tel:${school.phone}`, label: t("contact.call") },
    },
    school.publicEmail && {
      icon: Mail,
      label: t("contact.email"),
      value: school.publicEmail,
      action: { href: `mailto:${school.publicEmail}`, label: t("contact.write") },
    },
    school.address && {
      icon: MapPin,
      label: t("contact.address"),
      value: school.address,
      action: {
        // a plain map search for the address: no embedded map, nothing to set up
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${school.address.replace(/\s*\n\s*/g, ", ")}`)}`,
        label: t("contact.map"),
        external: true,
      },
    },
    school.website && {
      icon: Globe,
      label: t("contact.website"),
      value: school.website.replace(/^https?:\/\//, ""),
      action: { href: school.website, label: t("contact.visit"), external: true },
    },
  ].filter(Boolean) as ContactRow[];

  return (
    <div className="site-home flex min-h-screen flex-1 flex-col bg-canvas">
      <SchoolSiteHeader school={school} />

      <main className="flex-1">
        <HeroSection school={school} name={name} />

        {chapters.includes("about") && <AboutSection about={school.about} number={numberOf("about")} />}

        {chapters.includes("admission") && <AdmissionSection admission={school.admission} number={numberOf("admission")} />}

        <NoticesSection subdomain={school.subdomain} number={numberOf("notices")} />

        {chapters.includes("gallery") && <GallerySection photos={school.gallery} number={numberOf("gallery")} />}

        <Chapter id="contact" number={numberOf("contact")} title={t("contact.title")}>
          {contacts.length === 0 ? (
            <p className="border-y border-border/70 py-6 text-muted-foreground">{t("contact.none")}</p>
          ) : (
            <dl className="divide-y divide-border/70 border-y border-border/70">
              {contacts.map(({ icon: Icon, label, value, action }) => (
                <div key={label} className="grid gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline">
                  <dt className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Icon className="size-4 shrink-0 text-navy" />
                    {label}
                  </dt>
                  <dd className="text-lg font-medium break-words whitespace-pre-line tabular-nums">{value}</dd>
                  {action && (
                    <dd>
                      <a
                        href={action.href}
                        {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="-my-3 inline-flex items-center gap-1 rounded-sm py-3 text-sm font-semibold text-navy underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        {action.label}
                        {action.external ? <ArrowUpRight className="size-4" /> : <ArrowRight className="size-4" />}
                      </a>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          )}
        </Chapter>
      </main>

      <SiteFooter school={school} />
    </div>
  );
}
