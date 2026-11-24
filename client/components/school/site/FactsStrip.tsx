import { GraduationCap, Landmark, Trophy, Users, type LucideIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import type { SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { siteContainer } from "./siteStyles";

/*
 * The mockup's statistics strip under the about section: one box in a light deep teal, the same for
 * every school (16px corners, a light teal edge), each card a 30px icon in the deep accent beside its figure (extra bold) and its label,
 * the same width and centred in its column, ruled between them from 1024px (on a phone, a centred
 * stack: icon, figure, label). Two across on a phone and tablet, four from 1024px. The first two are counted by the app (active students, working teachers; a count of
 * none is left out); the last two are the same for every school: "A+ Quality Education" and
 * "100% Commitment".
 */
export async function FactsStrip({ stats }: { stats: SchoolSite["stats"] }) {
  const [t, format] = await Promise.all([getTranslations("schoolHome.stats"), getFormatter()]);
  const cards: { icon: LucideIcon; value: string; label: string }[] = [
    ...(stats.students > 0 ? [{ icon: GraduationCap, value: format.number(stats.students), label: t("students") }] : []),
    ...(stats.teachers > 0 ? [{ icon: Users, value: format.number(stats.teachers), label: t("teachers") }] : []),
    { icon: Trophy, value: t("qualityValue"), label: t("quality") },
    { icon: Landmark, value: t("commitmentValue"), label: t("commitment") },
  ];

  return (
    <div className="bg-white py-4">
      <div className={siteContainer}>
        <dl
          className={cn(
            "grid grid-cols-2 gap-x-4 gap-y-7 rounded-[16px] border border-site-teal-line bg-site-teal px-4 py-7 sm:px-8 lg:gap-0 lg:divide-x lg:divide-site-teal-line",
            cards.length === 3 && "lg:grid-cols-3",
            cards.length === 4 && "lg:grid-cols-4",
          )}
        >
          {cards.map(({ icon: Icon, value, label }) => (
            // on a phone each card is a centred stack (icon, figure, label), so the two rows line up;
            // from 640px the icon sits beside the figure, as in the mockup, each card the same width
            // centred in its column, so icons and figures line up from row to row
            <div key={label} className="flex flex-col items-center gap-2 text-center sm:mx-auto sm:w-48 sm:flex-row sm:gap-4 sm:text-left">
              <Icon aria-hidden className="size-7 shrink-0 text-brand-ink sm:size-8" strokeWidth={2} />
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="mt-1 text-xs font-medium text-slate-600">{label}</dt>
                <dd className="text-2xl leading-none font-extrabold text-brand-ink tabular-nums sm:text-3xl">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
