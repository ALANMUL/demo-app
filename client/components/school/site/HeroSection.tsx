import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Fragment } from "react";
import { publicSchoolRoutes } from "@/lib/auth/routes";
import { hasAbout, type SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { HeroStage } from "./HeroStage";
import { siteFocus, splitName } from "./siteStyles";

/*
 * The top of the homepage, as in the mockup: the school's photos across the width (HeroStage), and
 * on the white at their left its own short line (set in its settings) after a gold line, its name
 * over two lines, its tagline (or the default one), and two pill buttons: "Admission open 2027"
 * (only once the school has set the year it is open for), which opens the application form, and
 * "Explore our school", which goes to its about section (or its notices). Without slides the about
 * photo or the first gallery photos stand in.
 */
export async function HeroSection({ school, name }: { school: SchoolSite; name: string }) {
  const t = await getTranslations("schoolHome.hero");
  // the school's line in its parts: a dot, bullet, middle dot or bar between spaces separates them
  // ("Learning . Discipline . Career"), so "St. Mary" stays whole
  const heroLine = school.about.heroLine
    .trim()
    .split(/\s+[.•·|]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const openYear = school.admission.openYear.trim();
  const explore = hasAbout(school.about) ? "#about" : "#notices";
  const [first, second] = splitName(name);

  // the slides, else the about photo, else up to three gallery photos
  const slides =
    school.slides.length > 0
      ? school.slides
      : school.about.image
        ? [{ id: "about", image: school.about.image, caption: null }]
        : school.gallery.slice(0, 3);

  return (
    <HeroStage slides={slides} name={name}>
      {heroLine.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden className="inline-block h-0.5 w-10 shrink-0 bg-site-gold" />
          <span className="flex flex-wrap items-center gap-x-2.5 text-[11px] font-bold tracking-[0.2em] text-brand-ink uppercase sm:text-xs [html[lang=bn]_&]:text-[13px] [html[lang=bn]_&]:tracking-normal">
            {heroLine.map((part, i) => (
              <Fragment key={i}>
                {/* between the parts, a larger, heavier dot than the text's own */}
                {i > 0 && (
                  <span aria-hidden className="text-[1.25em] leading-none font-black tracking-normal">
                    •
                  </span>
                )}
                <span>{part}</span>
              </Fragment>
            ))}
          </span>
        </div>
      )}

      <h1 className="mb-4 text-3xl leading-[1.18] font-black text-brand-ink sm:text-4xl lg:text-[44px]">
        {first}
        {second && (
          <>
            <br />
            {second}
          </>
        )}
      </h1>

      <p className="mb-8 text-base font-medium text-slate-600 sm:text-lg">{school.about.tagline || t("tagline")}</p>

      <div className="flex flex-wrap items-center gap-4">
        {openYear && (
          <Link
            href={publicSchoolRoutes.apply}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full bg-brand-ink px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:shadow-lg",
              siteFocus,
            )}
          >
            <span>{t("admissionOpen", { year: openYear })}</span>
            <ArrowRight className="size-3" />
          </Link>
        )}
        <a
          href={explore}
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-brand-ink/30 bg-white/90 px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:border-brand-ink hover:bg-white",
            siteFocus,
          )}
        >
          {t("explore")}
        </a>
      </div>
    </HeroStage>
  );
}
