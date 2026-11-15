import { Banknote, CalendarDays, ClipboardList, type LucideIcon } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { withSign } from "@/lib/i18n/currency";
import type { Admission } from "@/lib/site";
import { Chapter } from "./Chapter";

/*
 * The homepage's admission chapter, as the school wrote it in its settings: one ruled sheet with
 * what to bring (numbered), the dates that matter and the fee schedule, each part titled in the
 * margin of the sheet. Fees in taka: "TK 2,000" in English, "৳২,০০০" in Bangla.
 */
export async function AdmissionSection({ admission, number }: { admission: Admission; number: number }) {
  const [t, format, locale] = await Promise.all([getTranslations("schoolHome.admission"), getFormatter(), getLocale()]);
  const { requirements, dates, fees } = admission;

  return (
    <Chapter id="admission" number={number} title={t("title")} tone="desk">
      <div className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-card">
        {requirements.length > 0 && (
          <Part icon={ClipboardList} title={t("requirements")}>
            <ol className="space-y-3">
              {requirements.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-6 shrink-0 text-right font-semibold text-navy tabular-nums">{format.number(i + 1)}.</span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ol>
          </Part>
        )}

        {dates.length > 0 && (
          <Part icon={CalendarDays} title={t("dates")}>
            <dl className="divide-y divide-border/70">
              {dates.map((d, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0">
                  <dt className="text-muted-foreground">{d.label}</dt>
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
                  <span aria-hidden className="min-w-6 flex-1 translate-y-[-0.3em] border-b border-dotted border-foreground/25" />
                  <dd className="shrink-0 font-semibold tabular-nums">{withSign(locale, format.number(f.amount))}</dd>
                </div>
              ))}
            </dl>
          </Part>
        )}
      </div>
    </Chapter>
  );
}

/* One part of the sheet: its title on the left (above, on a phone), its rows on the right. */
function Part({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 p-5 sm:p-7 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
      <h3 className="flex items-center gap-2.5 self-start text-lg font-semibold">
        <Icon className="size-5 shrink-0 text-navy" />
        {title}
      </h3>
      <div className="text-base leading-relaxed">{children}</div>
    </div>
  );
}
