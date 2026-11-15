import { getTranslations } from "next-intl/server";
import type { About } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Chapter } from "./Chapter";

/*
 * The homepage's about chapter, as the school wrote it in its settings: its words (a blank line
 * starts a paragraph; the first reads a little larger), its picture in a plain frame beside them,
 * and its facts ruled into a row of figures underneath.
 */
export async function AboutSection({ about, number }: { about: About; number: number }) {
  const t = await getTranslations("schoolHome.about");
  const paragraphs = about.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const withPicture = !!about.image;

  return (
    <Chapter id="about" number={number} title={t("title")}>
      <div className={cn("grid gap-10", withPicture && paragraphs.length > 0 && "xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12")}>
        {paragraphs.length > 0 && (
          <div className="max-w-[68ch] space-y-4 leading-relaxed text-foreground/85">
            {paragraphs.map((p, i) => (
              <p key={i} className={cn("whitespace-pre-line", i === 0 ? "text-lg text-foreground sm:text-xl" : "text-base sm:text-lg")}>
                {p}
              </p>
            ))}
          </div>
        )}

        {withPicture && (
          <figure className="rounded-2xl border border-border/70 bg-card p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
            <img src={about.image!} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover" />
          </figure>
        )}
      </div>

      {about.facts.length > 0 && (
        // ruled like a table: hairlines between the figures, whatever the number of rows
        <dl
          className={cn(
            "mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70",
            about.facts.length >= 3 && "sm:grid-cols-3",
            about.facts.length >= 4 && "lg:grid-cols-4",
          )}
        >
          {about.facts.map((fact, i) => (
            <div key={i} className="flex flex-col-reverse justify-end gap-1.5 bg-card px-5 py-6">
              <dt className="text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="text-3xl leading-none font-bold tracking-[-0.02em] text-navy tabular-nums sm:text-4xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Chapter>
  );
}
