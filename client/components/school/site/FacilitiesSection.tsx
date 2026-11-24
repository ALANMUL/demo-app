import { getTranslations } from "next-intl/server";
import { FACILITY_ICONS, isSiteFacility } from "@/lib/siteFacilities";
import { SiteSection } from "./SiteSection";

/*
 * The homepage's "Our facilities", as in the mockup: the ones the school ticked in its settings,
 * as even tiles in the same light deep teal as the stats strip (16px corners, its light teal edge,
 * at least 128px tall), each its icon over
 * its name, centred.
 * Two across on a phone, three from 640px, six from 1024px.
 */
export async function FacilitiesSection({ facilities }: { facilities: string[] }) {
  const t = await getTranslations("schoolHome.facilities");
  const keys = facilities.filter(isSiteFacility);

  return (
    <SiteSection id="facilities" label={t("label")} title={t("title")} className="py-10">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {keys.map((key) => {
          const Icon = FACILITY_ICONS[key];
          return (
            <li key={key} className="flex min-h-32 flex-col items-center justify-center rounded-[16px] border border-site-teal-line bg-site-teal px-5 py-7 text-center">
              <Icon aria-hidden className="mb-3 size-6 text-brand-ink" strokeWidth={2} />
              <span className="site-serif block text-xs leading-snug font-bold text-brand-ink sm:text-[13px]">{t(`items.${key}`)}</span>
            </li>
          );
        })}
      </ul>
    </SiteSection>
  );
}
