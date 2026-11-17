import { BookOpenCheck, ClipboardCheck, GraduationCap, LayoutDashboard, Lock, MessageSquareText, Users, Wallet } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { withSign } from "@/lib/i18n/currency";
import { cn } from "@/lib/utils";

// the sidebar's menu, the first one open
const MENU = [
  ["dashboard", LayoutDashboard],
  ["students", Users],
  ["attendance", ClipboardCheck],
  ["exams", BookOpenCheck],
  ["fees", Wallet],
  ["messages", MessageSquareText],
] as const;

// attendance through the week, Sunday to Thursday (today), as a share of the students
const WEEK = [
  ["sun", 92],
  ["mon", 95],
  ["tue", 89],
  ["wed", 94],
  ["thu", 96],
] as const;

const PAYMENTS = [
  ["p1", "1,500"],
  ["p2", "2,500"],
  ["p3", "1,800"],
] as const;

/*
 * The hero's picture: a school's dashboard as the app draws it, the navy sidebar beside today's
 * numbers, the week's attendance and the latest payments. Drawn, not a screenshot, so it follows
 * the language. The week's bars rise one after another as the page opens (the one moving thing
 * on the page); with less motion they are simply there. A sample, described in one sentence.
 */
export async function Dashboard() {
  const t = await getTranslations("marketing.hero.dashboard");
  const locale = await getLocale();

  const stats = [
    ["students", "1,248"],
    ["present", "96%"],
    ["fees", withSign(locale, "4,52,000")],
    ["teachers", "64"],
  ] as const;

  return (
    <figure className="relative w-full">
      <figcaption className="sr-only">{t("caption")}</figcaption>
      <div
        aria-hidden
        className="overflow-hidden rounded-lg border border-mk-rule bg-white text-left shadow-[0_32px_60px_-30px_rgb(10_36_95/0.45)]"
      >
        {/* the browser's address bar */}
        <div className="flex items-center gap-3 border-b border-mk-rule bg-white px-3 py-2">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-mk-rule" />
            ))}
          </span>
          <span className="mx-auto flex items-center gap-1.5 rounded bg-mk-sky px-3 py-0.5 text-[12px] text-mk-slate" data-ascii-digits>
            <Lock className="size-3" />
            {t("address")}
          </span>
        </div>

        <div className="flex">
          {/* the sidebar */}
          <div className="hidden w-36 shrink-0 bg-mk-ink px-2.5 py-3 text-white sm:block">
            <p className="flex items-center gap-2 px-1.5 pb-3 text-[13px] font-bold">
              <span className="flex size-6 items-center justify-center rounded bg-white/10 text-mk-gold">
                <GraduationCap className="size-3.5" />
              </span>
              <span className="truncate">{t("school")}</span>
            </p>
            <ul className="space-y-0.5 text-[13px]">
              {MENU.map(([key, Icon], i) => (
                <li
                  key={key}
                  className={cn(
                    "relative flex items-center gap-2 rounded px-2 py-1.5",
                    i === 0 ? "bg-white/10 font-semibold text-white" : "text-white/70",
                  )}
                >
                  {i === 0 && <span className="absolute inset-y-1.5 -left-2.5 w-[3px] rounded-r bg-mk-gold" />}
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{t(`menu.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* the page */}
          <div className="min-w-0 flex-1 space-y-3 bg-mk-wash p-3 sm:p-4">
            <div>
              <p className="text-[15px] font-bold text-mk-ink">{t("greeting")}</p>
              <p className="text-[12px] text-mk-slate">{t("date")}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {stats.map(([key, value]) => (
                <div key={key} className="rounded-md border border-mk-rule bg-white px-3 py-2">
                  <p className="truncate text-[11px] text-mk-slate">{t(`stats.${key}`)}</p>
                  <p className="text-lg leading-tight font-bold text-mk-ink tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-2 lg:grid-cols-[1fr_1.15fr]">
              <div className="rounded-md border border-mk-rule bg-white p-3">
                <p className="text-[12px] font-semibold text-mk-ink">{t("chart")}</p>
                <div className="mt-2 flex h-24 items-end gap-2">
                  {WEEK.map(([day, share], i) => (
                    <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <span
                        className={cn("mk-bar w-full rounded-t-sm", i === WEEK.length - 1 ? "bg-mk-gold" : "bg-mk-ink")}
                        // the bars start at 80%, so the differences show
                        style={{ height: `${(share - 80) * 5}%`, "--i": i } as CSSProperties}
                      />
                      <span className="text-[10px] text-mk-slate">{t(`days.${day}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-mk-rule bg-white p-3">
                <p className="text-[12px] font-semibold text-mk-ink">{t("payments")}</p>
                <ul className="mt-1.5 divide-y divide-mk-rule">
                  {PAYMENTS.map(([key, amount]) => (
                    <li key={key} className="flex items-center justify-between gap-2 py-1.5">
                      <span className="min-w-0">
                        <span className="block truncate text-[12px] text-mk-ink">{t(`people.${key}.name`)}</span>
                        <span className="block text-[10px] text-mk-slate">{t(`people.${key}.class`)}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[12px] font-semibold text-mk-ink tabular-nums">{withSign(locale, amount)}</span>
                        <span className="block text-[10px] font-semibold text-emerald-700">{t("paid")}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
