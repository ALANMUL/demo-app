import { Quote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { About } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AboutMore } from "./AboutText";
import { SiteLabel } from "./SiteLabel";
import { siteContainer, siteScrollMargin } from "./siteStyles";

/*
 * The homepage's about section, as in the mockup: from 1024px one row of up to three even columns,
 * centred on each other: its picture (256px tall, 16px corners, a soft shadow); its orange label,
 * the heading, the start of its words and a small "Learn more" pill (the whole story, and the
 * principal's whole message, open in a window); and its principal's message on a card in the pale
 * tint, with a gold quote mark and their round photo. Parts the school left empty drop out.
 */
export async function AboutSection({ about }: { about: About }) {
  const t = await getTranslations("schoolHome.about");
  const paragraphs = about.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const message = about.principalMessage.trim();
  const title = about.principalTitle.trim() || t("principalTitle");
  const name = about.principalName.trim();
  const heading = t("principalHeading", { title });
  const columns = [!!about.image, true, !!message].filter(Boolean).length;
  const span = columns === 3 ? "lg:col-span-4" : columns === 2 ? "lg:col-span-6" : "lg:col-span-8";

  return (
    <section id="about" aria-labelledby="about-title" className={cn(siteScrollMargin, "bg-white py-12 lg:py-16")}>
      <div className={siteContainer}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {about.image && (
            <div className={span}>
              <div className="overflow-hidden rounded-[16px] border border-slate-100 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
                <img src={about.image} alt="" loading="lazy" decoding="async" className="h-64 w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            </div>
          )}

          <div className={span}>
            <SiteLabel>{t("label")}</SiteLabel>
            <h2 id="about-title" className="mt-1.5 text-2xl font-bold text-brand-ink sm:text-[26px]">
              {t("title")}
            </h2>
            {paragraphs.length > 0 && <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-slate-600">{paragraphs[0]}</p>}
            {/* the whole story and the whole message, whichever the school wrote */}
            <div className="mt-4 pt-1">
              <AboutMore
                label={t("learnMore")}
                title={t("title")}
                paragraphs={paragraphs}
                principal={message ? { heading, message, name, title, photo: about.principalPhoto } : null}
              />
            </div>
          </div>

          {message && (
            <div className={span}>
              <figure className="rounded-[16px] border border-site-line/70 bg-site-ice p-6 shadow-sm sm:p-7">
                <figcaption className="mb-3 flex items-center gap-2.5">
                  <Quote aria-hidden className="size-6 shrink-0 fill-site-gold text-site-gold" strokeWidth={0} />
                  <span className="site-serif text-lg font-bold text-brand-ink">{heading}</span>
                </figcaption>
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    {/* the start of the message; the whole of it is behind "Learn more" */}
                    <blockquote className="mb-3 line-clamp-5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">{message}</blockquote>
                    <p className="text-xs font-bold text-brand-ink sm:text-sm">
                      &mdash; {name || title}
                      {name && <span className="ml-1.5 font-normal text-slate-500">{title}</span>}
                    </p>
                  </div>
                  {about.principalPhoto && (
                    <div className="size-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
                      <img src={about.principalPhoto} alt={name || title} loading="lazy" decoding="async" className="size-full object-cover" />
                    </div>
                  )}
                </div>
              </figure>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
