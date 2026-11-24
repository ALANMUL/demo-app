import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { AboutSection } from "@/components/school/site/AboutSection";
import { AdmissionSection } from "@/components/school/site/AdmissionSection";
import { FacilitiesSection } from "@/components/school/site/FacilitiesSection";
import { FactsStrip } from "@/components/school/site/FactsStrip";
import { GallerySection } from "@/components/school/site/GallerySection";
import { HeroSection } from "@/components/school/site/HeroSection";
import { NoticesSection } from "@/components/school/site/NoticesSection";
import { SchoolSiteHeader } from "@/components/school/site/SchoolSiteHeader";
import { SiteFonts } from "@/components/school/site/SiteFonts";
import { SiteFooter } from "@/components/school/site/SiteFooter";
import { TeachersSection } from "@/components/school/site/TeachersSection";
import { pickName } from "@/lib/i18n/names";
import { siteChapters } from "@/lib/site";
import { getCurrentSchoolSite } from "@/lib/site.server";

export async function generateMetadata(): Promise<Metadata> {
  const [school, locale] = await Promise.all([getCurrentSchoolSite(), getLocale()]);
  return school ? { title: pickName(school, locale) } : {};
}

/**
 * A school's public homepage (no login), laid out as the agreed mockup on white: the header, the
 * hero (its photos under a white veil, with its name, lines and the way to admission beside them),
 * then a part per menu item: about (with its facts as a strip under it), the teachers row, the
 * notice cards, the facilities, admission and the gallery (those the school left empty are
 * skipped), and the footer, which is the contact part. The menu scrolls to them.
 */
export default async function SchoolHomePage() {
  const [locale, school] = await Promise.all([getLocale(), getCurrentSchoolSite()]);
  // the school layout has already 404'd an unknown or inactive school
  if (!school) return null;
  // the name in the language being read (the other one only when this one is missing)
  const name = pickName(school, locale);

  // the parts the school has filled in (notices and contact always show)
  const chapters = siteChapters(school);

  return (
    <div className="site-home flex min-h-screen flex-1 flex-col bg-white text-slate-800">
      <SiteFonts />
      <SchoolSiteHeader school={school} />

      <main className="flex-1">
        <HeroSection school={school} name={name} />

        {chapters.includes("about") && <AboutSection about={school.about} />}

        <FactsStrip stats={school.stats} />

        {chapters.includes("teachers") && <TeachersSection teachers={school.teachers} />}

        <NoticesSection subdomain={school.subdomain} />

        {chapters.includes("facilities") && <FacilitiesSection facilities={school.about.facilities} />}

        {chapters.includes("admission") && <AdmissionSection admission={school.admission} />}

        {chapters.includes("gallery") && <GallerySection photos={school.gallery} />}
      </main>

      <SiteFooter school={school} />
    </div>
  );
}
