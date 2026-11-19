import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Dashboard } from "./Dashboard";
import { FitDashboard } from "./FitDashboard";
import { MarginRow, Note } from "./Margin";

/*
 * The top of the homepage, on ruled sky-blue khata paper: the headline across the page, then what
 * the platform does and the two ways on, beside a drawing of a school's dashboard. From 1024px, where
 * the drawing sits beside the words, it fills the window under the header (65px) with its content
 * centred: on a short window (up to 840px tall, or 700px) the headline and the gaps shrink, and the
 * drawing zooms itself to fit its column and the window (FitDashboard), so all of it shows at once.
 */
export async function Hero() {
  const t = await getTranslations("marketing.hero");

  return (
    <section aria-labelledby="hero-title" className="mk-ruled bg-mk-sky lg:flex lg:min-h-[calc(100svh-65px)] lg:flex-col">
      <MarginRow className="h-12 sm:h-20 lg:h-auto" rowClassName="lg:min-h-10 lg:flex-[2] short-screen:min-h-4" />
      <MarginRow note={<Note className="max-lg:mb-5 lg:pt-4">{t("note")}</Note>}>
        <h1 id="hero-title" className="mk-display max-w-4xl text-[2.75rem] text-mk-ink sm:text-[3.5rem] xl:text-[4.25rem] short-screen:text-[3.5rem] shorter-screen:text-[3rem]">
          {t("title")}
        </h1>

        <div className="mt-10 grid items-start gap-x-8 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] xl:grid-cols-[minmax(0,1fr)_33rem] xl:gap-x-12 short-screen:mt-6 shorter-screen:mt-5">
          <div className="lg:pt-2">
            <p className="max-w-xl text-lg leading-[1.65] text-pretty text-mk-slate sm:text-xl sm:leading-[1.6] shorter-screen:text-lg">{t("subtitle")}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 short-screen:mt-6">
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

            <ul className="mt-10 flex flex-col gap-2.5 text-base text-mk-slate short-screen:mt-6">
              {(["proof1", "proof2", "proof3"] as const).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-mk-ink" strokeWidth={2.5} />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          {/* zoomed to fit its column and the window; the guess before that runs is by width */}
          <FitDashboard className="min-w-0 lg:[--fit-guess:0.66] xl:[--fit-guess:1] short-screen:xl:[--fit-guess:0.85]">
            <Dashboard />
          </FitDashboard>
        </div>
      </MarginRow>
      <MarginRow className="h-20 sm:h-28 lg:h-auto" rowClassName="lg:min-h-10 lg:flex-[3] short-screen:min-h-4" />
    </section>
  );
}
