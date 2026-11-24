import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ApplicationForm } from "@/components/school/site/ApplicationForm";
import { SchoolSiteHeader } from "@/components/school/site/SchoolSiteHeader";
import { SiteFonts } from "@/components/school/site/SiteFonts";
import { SiteFooter } from "@/components/school/site/SiteFooter";
import { pickName } from "@/lib/i18n/names";
import { getCurrentSchoolSite } from "@/lib/site.server";

export async function generateMetadata(): Promise<Metadata> {
  const [school, locale, t] = await Promise.all([getCurrentSchoolSite(), getLocale(), getTranslations("schoolHome.apply")]);
  return school ? { title: `${t("title")} · ${pickName(school, locale)}` } : {};
}

/**
 * The school's admission application form (no login), reached from the homepage's "Admission open"
 * button: the school's header and footer around the form. For now a preview: what is filled in
 * stays in the browser and is not sent to the school.
 */
export default async function ApplyPage() {
  const [locale, school] = await Promise.all([getLocale(), getCurrentSchoolSite()]);
  // the school layout has already 404'd an unknown or inactive school
  if (!school) return null;

  return (
    <div className="site-home flex min-h-screen flex-1 flex-col bg-canvas">
      <SiteFonts />
      <SchoolSiteHeader school={school} onHome={false} />
      <main className="flex-1">
        <ApplicationForm schoolName={pickName(school, locale)} openYear={school.admission.openYear.trim()} />
      </main>
      <SiteFooter school={school} />
    </div>
  );
}
