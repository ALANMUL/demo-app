import { Quote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { About } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AboutMore } from "./AboutText";

/*
 * The homepage's about section, as the school wrote it in its settings: one compact row of up to
 * three parts of the same height. Its picture; a short gold line, the heading, the start of its
 * words and "Learn more" (the whole story, and the principal's whole message, in a window); and its
 * principal's message on a card in the accent's tint, with a gold quote mark and their round photo.
 * Its facts follow as a row of figures. The school's colours come from its accent: the tint
 * (--brand-soft), the deep shade (--navy, --primary); the gold marks are the menu's gold.
 */
export async function AboutSection({ about }: { about: About }) {
  const t = await getTranslations("schoolHome.about");
  const paragraphs = about.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const message = about.principalMessage.trim();
  const columns = [!!about.image, paragraphs.length > 0, !!message].filter(Boolean).length;
  const title = about.principalTitle.trim() || t("principalTitle");
  const name = about.principalName.trim();
  const heading = t("principalHeading", { title });

  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 border-t border-border/70 bg-card sm:scroll-mt-22">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div
          className={cn(
            "grid gap-8 lg:gap-10",
            columns === 3 && "md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr]",
            columns === 2 && "md:grid-cols-2",
          )}
        >
          {about.image && (
            // as tall as the row beside it (at least 4:3 wide on its own)
            <figure className={cn("relative min-h-56 overflow-hidden rounded-2xl", columns === 3 && "md:col-span-2 lg:col-span-1")}>
              {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
              <img
                src={about.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover shadow-[0_18px_40px_-24px_rgb(15_23_42/0.45)]"
              />
            </figure>
          )}

          <div className={cn("self-center", !about.image && !message && "max-w-3xl")}>
            <span aria-hidden className="block h-1 w-12 rounded-full bg-sidebar-primary" />
            <h2 id="about-title" className="mt-4 text-[1.75rem] leading-tight font-bold tracking-[-0.015em] text-navy text-balance sm:text-3xl">
              {t("title")}
            </h2>
            {paragraphs.length > 0 && (
              <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed whitespace-pre-line text-foreground/85 sm:text-base">{paragraphs[0]}</p>
            )}
            {/* the whole story and the whole message, whichever the school wrote */}
            <AboutMore
              label={t("learnMore")}
              title={t("title")}
              paragraphs={paragraphs}
              principal={message ? { heading, message, name, title, photo: about.principalPhoto } : null}
            />
          </div>

          {message && (
            <figure className="flex flex-col rounded-2xl bg-brand-soft p-6">
              <figcaption className="flex items-center gap-2.5">
                <Quote aria-hidden className="size-7 shrink-0 fill-sidebar-primary text-sidebar-primary" strokeWidth={0} />
                <span className="text-lg leading-snug font-bold text-navy sm:text-xl">{heading}</span>
              </figcaption>
              <div className="mt-4 flex flex-1 items-start gap-4">
                {/* the start of the message; the whole of it is behind "Learn more" */}
                <blockquote className="line-clamp-5 min-w-0 flex-1 text-[15px] leading-relaxed whitespace-pre-line text-foreground/85">{message}</blockquote>
                {about.principalPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element -- signed links to private storage
                  <img
                    src={about.principalPhoto}
                    alt={name || title}
                    loading="lazy"
                    decoding="async"
                    className="size-20 shrink-0 rounded-full object-cover shadow-md ring-4 ring-card sm:size-24"
                  />
                )}
              </div>
              <p className="mt-4 font-bold text-navy">
                — {name || title}
                {name && <span className="ml-1.5 text-sm font-normal text-muted-foreground">{title}</span>}
              </p>
            </figure>
          )}
        </div>

        {about.facts.length > 0 && (
          // a row of figures on the accent's tint, ruled between them
          <dl
            className={cn(
              "mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand/15 bg-brand/15",
              about.facts.length >= 3 && "sm:grid-cols-3",
              about.facts.length >= 4 && "lg:grid-cols-4",
            )}
          >
            {about.facts.map((fact, i) => (
              <div key={i} className="flex flex-col-reverse justify-end gap-1.5 bg-brand-soft px-6 py-6">
                <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                <dd className="text-3xl leading-none font-bold tracking-[-0.02em] text-navy tabular-nums sm:text-4xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
