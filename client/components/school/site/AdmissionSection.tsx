import { Banknote, CalendarDays, ClipboardList, type LucideIcon } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { withSign } from "@/lib/i18n/currency";
import type { Admission } from "@/lib/site";
import { SiteSection } from "./SiteSection";

/*
 * The homepage's admission section, as the school wrote it in its settings: one ruled sheet with
 * what to bring (numbered), the dates that matter and the fee schedule, each part titled in the
 * margin of the sheet. Fees in taka: "TK 2,000" in English, "৳২,০০০" in Bangla.
 */
export async function AdmissionSection({ admission }: { admission: Admission }) {
  const [t, format, locale] = await Promise.all([getTranslations("schoolHome.admission"), getFormatter(), getLocale()]);
  const { requirements, dates, fees } = admission;

  return (
    <SiteSection id="admission" label={t("label")} title={t("title")}>
      <div className="divide-y divide-slate-200/80 overflow-hidden rounded-[12px] border border-slate-200/80 bg-white shadow-sm">
        {requirements.length > 0 && (
          <Part icon={ClipboardList} title={t("requirements")}>
            <ol className="space-y-3">
              {requirements.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-6 shrink-0 text-right font-semibold text-brand-ink tabular-nums">{format.number(i + 1)}.</span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ol>
          </Part>
        )}

        {dates.length > 0 && (
          <Part icon={CalendarDays} title={t("dates")}>
            <dl className="divide-y divide-slate-200/80">
              {dates.map((d, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0">
                  <dt className="text-slate-500">{d.label}</dt>
                  <dd className="font-semibold">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Part>
        )}

        {fees.length > 0 && (
          <Part icon={Banknote} title={t("fees")}>
            <dl className="space-y-3">
              {fees.map((f, i) => (
                // the label, a dotted leader, the amount: as on a printed fee schedule
                <div key={i} className="flex items-baseline gap-3">
                  <dt className="min-w-0">{f.label}</dt>
                  <span aria-hidden className="min-w-6 flex-1 translate-y-[-0.3em] border-b border-dotted border-slate-300" />
                  <dd className="shrink-0 font-semibold tabular-nums">{withSign(locale, format.number(f.amount))}</dd>
                </div>
              ))}
            </dl>
          </Part>
        )}
      </div>
    </SiteSection>
  );
}

/* One part of the sheet: its title on the left (above, on a phone), its rows on the right. */
function Part({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
      <h3 className="flex items-center gap-2.5 self-start text-base font-bold text-brand-ink">
        <Icon className="size-5 shrink-0 text-brand-ink" />
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}
