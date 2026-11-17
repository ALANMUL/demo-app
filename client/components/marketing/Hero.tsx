import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Dashboard } from "./Dashboard";
import { MarginRow, Note } from "./Margin";

/*
 * The top of the homepage, on ruled sky-blue khata paper: the headline across the page, then what
 * the platform does and the two ways on, beside a drawing of a school's dashboard.
 */
export async function Hero() {
  const t = await getTranslations("marketing.hero");

  return (
    <section aria-labelledby="hero-title" className="mk-ruled bg-mk-sky">
      <MarginRow className="h-12 sm:h-20" />
      <MarginRow note={<Note className="max-lg:mb-5 lg:pt-4">{t("note")}</Note>}>
        <h1 id="hero-title" className="mk-display max-w-4xl text-[2.75rem] text-mk-ink sm:text-[3.5rem] lg:text-[4.25rem]">
          {t("title")}
        </h1>

        <div className="mt-10 grid items-start gap-x-12 gap-y-14 xl:grid-cols-[minmax(0,1fr)_33rem]">
          <div className="xl:pt-2">
            <p className="max-w-xl text-lg leading-[1.65] text-pretty text-mk-slate sm:text-xl sm:leading-[1.6]">{t("subtitle")}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center rounded-md bg-mk-ink px-7 text-base font-semibold text-white transition-colors hover:bg-mk-ink-2 focus-visible:ring-2 focus-visible:ring-mk-ink focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t("primary")}
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center justify-center rounded-md px-2 text-base font-semibold text-mk-ink underline decoration-mk-ink/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-mk-ink focus-visible:ring-2 focus-visible:ring-mk-ink focus-visible:outline-none"
              >
                {t("secondary")}
              </a>
            </div>

            <ul className="mt-10 flex flex-col gap-2.5 text-base text-mk-slate">
              {(["proof1", "proof2", "proof3"] as const).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-mk-ink" strokeWidth={2.5} />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <Dashboard />
        </div>
      </MarginRow>
      <MarginRow className="h-20 sm:h-28" />
    </section>
  );
}
