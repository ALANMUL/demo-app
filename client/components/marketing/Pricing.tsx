"use client";

import { Check } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { withSign } from "@/lib/i18n/currency";
import {
  CHOOSE_PACKAGE_EVENT,
  INCLUDED_FEATURES,
  priceOf,
  yearlySaving,
  type Billing,
  type ChoosePackageDetail,
  type PublicPackage,
} from "@/lib/marketing/packages";
import { jumpToSection } from "@/lib/useSectionNav";
import { cn } from "@/lib/utils";
import { MarginHeading, MarginRow, Note } from "./Margin";

const BILLINGS: Billing[] = ["MONTHLY", "YEARLY"];

/*
 * The packages, on white paper, as the platform admin set them: a monthly / yearly switch, then one
 * ruled sheet with a column per package (the middle one in solid navy when there are three or more), and under it
 * what every package includes. Without packages (the server can't be reached) it asks visitors to
 * get in touch.
 */
export function Pricing({ packages }: { packages: PublicPackage[] }) {
  const t = useTranslations("marketing.pricing");
  const format = useFormatter();
  const locale = useLocale();
  const [billing, setBilling] = useState<Billing>("MONTHLY");
  const maxSaving = Math.max(0, ...packages.map(yearlySaving));
  const popular = packages.length >= 3 ? Math.floor(packages.length / 2) : -1;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-16 bg-white">
      <MarginRow className="h-20 sm:h-28" />
      <MarginRow note={<Note className="max-lg:mb-4 lg:pt-3">{t("eyebrow")}</Note>}>
        <MarginHeading id="pricing-title" title={t("title")} subtitle={t("subtitle")} />

        {packages.length === 0 ? (
          <p className="mt-10 max-w-xl rounded-md border border-mk-rule bg-mk-wash p-6 text-lg text-mk-ink">
            {t.rich("unavailable", { link: (chunks) => <ContactLink>{chunks}</ContactLink> })}
          </p>
        ) : (
          <>
            {/* monthly / yearly */}
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div role="group" aria-label={t("billing")} className="inline-flex rounded-md border border-mk-ink p-0.5">
                {BILLINGS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={billing === option}
                    onClick={() => setBilling(option)}
                    className={cn(
                      "min-w-28 rounded-[5px] px-5 py-2 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-mk-ink focus-visible:ring-offset-2 focus-visible:outline-none",
                      billing === option ? "bg-mk-ink text-white" : "text-mk-ink hover:bg-mk-wash",
                    )}
                  >
                    {t(option === "MONTHLY" ? "monthly" : "yearly")}
                  </button>
                ))}
              </div>
              {maxSaving > 0 && <p className="mk-note text-base text-mk-slate">{t("saveUpTo", { amount: withSign(locale, format.number(maxSaving)) })}</p>}
            </div>

            <div
              className={cn(
                "mt-8 grid overflow-hidden rounded-md border border-mk-rule shadow-[0_24px_48px_-32px_rgb(10_36_95/0.35)] max-md:divide-y max-md:divide-mk-rule md:divide-x md:divide-mk-rule",
                packages.length >= 3 ? "md:grid-cols-3" : packages.length === 2 ? "max-w-3xl md:grid-cols-2" : "max-w-md",
              )}
            >
              {packages.map((pkg, i) => (
                <PackageColumn key={pkg.code} pkg={pkg} billing={billing} popular={i === popular} />
              ))}
            </div>

            {/* every package has all of it */}
            <div className="mt-14">
              <h3 className="text-xl font-bold text-mk-ink">{t("includedTitle")}</h3>
              <p className="mt-1 text-base text-mk-slate">{t("includedSubtitle")}</p>
              <ul className="mt-6 grid max-w-4xl gap-x-8 gap-y-3 text-base text-mk-ink sm:grid-cols-2 lg:grid-cols-3">
                {INCLUDED_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-1 size-4 shrink-0" strokeWidth={2.5} />
                    {t(`features.${feature}`)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <p className="mt-12 max-w-2xl text-base text-mk-slate">{t.rich("note", { link: (chunks) => <ContactLink>{chunks}</ContactLink> })}</p>
      </MarginRow>
      <MarginRow className="h-24 sm:h-32" />
    </section>
  );
}

function ContactLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#contact"
      onClick={(e) => jumpToSection("contact", "/", e)}
      className="font-semibold text-mk-ink underline decoration-mk-rule decoration-2 underline-offset-4 hover:decoration-mk-ink"
    >
      {children}
    </a>
  );
}

function PackageColumn({ pkg, billing, popular }: { pkg: PublicPackage; billing: Billing; popular: boolean }) {
  const t = useTranslations("marketing.pricing");
  const format = useFormatter();
  const locale = useLocale();
  const saving = billing === "YEARLY" ? yearlySaving(pkg) : 0;

  // tell the contact form, then go there
  const choose = () => {
    window.dispatchEvent(new CustomEvent<ChoosePackageDetail>(CHOOSE_PACKAGE_EVENT, { detail: { code: pkg.code, billing } }));
    jumpToSection("contact");
  };

  // the chosen-most one is solid navy, with light words
  const quiet = popular ? "text-white/70" : "text-mk-slate";
  const strong = popular ? "text-white" : "text-mk-ink";

  return (
    <article className={cn("relative flex flex-col p-6 sm:p-8", popular ? "bg-mk-ink" : "bg-white")}>
      <p className={cn("h-5 text-sm font-semibold text-mk-gold", !popular && "max-md:hidden")}>{popular && t("popular")}</p>
      <h3 className={cn("mt-2 text-2xl", strong)}>{pkg.name}</h3>
      <p className={cn("mt-1 text-base", quiet)}>
        {pkg.maxStudents === null ? t("unlimited") : t("upTo", { count: format.number(pkg.maxStudents) })}
      </p>

      <div className={cn("mt-7 border-t pt-6", popular ? "border-white/15" : "border-mk-rule")}>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className={cn("text-[2.75rem] leading-none tabular-nums", strong)}>{withSign(locale, format.number(priceOf(pkg, billing)))}</span>
          <span className={cn("text-base", quiet)}>{t(billing === "MONTHLY" ? "perMonth" : "perYear")}</span>
        </p>
        <p className={cn("mt-2 min-h-6 text-base", quiet)}>
          {billing === "MONTHLY" ? (
            t("billedMonthly")
          ) : saving > 0 ? (
            <span className={cn("font-semibold", popular ? "text-mk-mint" : "text-emerald-700")}>{t("save", { amount: withSign(locale, format.number(saving)) })}</span>
          ) : (
            t("billedYearly")
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={choose}
        className={cn(
          "mt-8 inline-flex h-11 items-center justify-center rounded-md px-5 text-base font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-mk-ink focus-visible:ring-offset-2 focus-visible:outline-none",
          popular
            ? "bg-mk-gold text-mk-ink hover:bg-white focus-visible:ring-mk-gold focus-visible:ring-offset-mk-ink"
            : "border border-mk-ink text-mk-ink hover:bg-mk-sky",
        )}
      >
        {t("choose", { name: pkg.name })}
      </button>
      <p className={cn("mt-4 text-center text-sm", quiet)}>{t("allFeatures")}</p>
    </article>
  );
}
