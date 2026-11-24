"use client";

import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "./SiteSection";

type Card = { id: string; name: string; designation: string | null; photo: string | null };

/*
 * The teachers as a row that slides a page at a time: the heading (a small orange label, then the
 * title in the accent's deep shade) with round arrows across from it, the cards (five across
 * from 1024px, four from 768px, three from 640px, two on a phone, where it also swipes), and a
 * dot per page under them, the current one a gold pill. Arrows and dots show only when the
 * cards don't all fit. Native scrolling with snap points: no slider library.
 */
export function TeacherSlider({
  label,
  heading,
  headingId,
  labels,
  teachers,
}: {
  // the small orange label above the heading
  label: string;
  heading: string;
  headingId: string;
  labels: { previous: string; next: string; page: string };
  teachers: Card[];
}) {
  const track = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  // the number of pages and the one in view, from the track's scroll
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const count = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05));
    setPages(count);
    const end = el.scrollWidth - el.clientWidth;
    setPage(end <= 1 ? 0 : Math.round((el.scrollLeft / end) * (count - 1)));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const behavior = (): ScrollBehavior => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  const go = (to: number) => {
    const el = track.current;
    if (!el) return;
    const end = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: pages <= 1 ? 0 : (end * Math.min(Math.max(to, 0), pages - 1)) / (pages - 1), behavior: behavior() });
  };
  const sliding = pages > 1;
  const arrow =
    "flex size-9 items-center justify-center rounded-full border border-slate-100 bg-white text-brand-ink shadow-md transition hover:bg-brand-ink hover:text-white disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink";

  return (
    <>
      <SiteHeader
        label={label}
        title={heading}
        headingId={headingId}
        action={
          sliding && (
            <div className="flex shrink-0 gap-2.5">
              <button type="button" aria-label={labels.previous} onClick={() => go(page - 1)} disabled={page === 0} className={arrow}>
                <ChevronLeft className="size-3.5" />
              </button>
              <button type="button" aria-label={labels.next} onClick={() => go(page + 1)} disabled={page >= pages - 1} className={arrow}>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )
        }
      />

      <ul
        ref={track}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {teachers.map((teacher) => (
          <li
            key={teacher.id}
            className="shrink-0 basis-[calc((100%-1rem)/2)] snap-start sm:basis-[calc((100%-2rem)/3)] md:basis-[calc((100%-3rem)/4)] lg:basis-[calc((100%-4rem)/5)]"
          >
            <article className="flex h-full flex-col items-center rounded-[12px] border border-site-line/70 bg-site-ice px-3 pt-6 pb-5 text-center sm:px-4">
              {teacher.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- signed links to private storage
                <img
                  src={teacher.photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-24 rounded-full border-2 border-white object-cover shadow-md sm:size-28"
                />
              ) : (
                <span className="flex size-24 items-center justify-center rounded-full border-2 border-white bg-white text-brand-ink/70 shadow-md sm:size-28">
                  <UserRound aria-hidden className="size-12 sm:size-14" strokeWidth={1.5} />
                </span>
              )}
              <h3 className="mt-4 line-clamp-2 text-sm leading-snug font-bold text-brand-ink sm:text-[15px]">{teacher.name}</h3>
              {teacher.designation && <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-600 sm:text-[13px]">{teacher.designation}</p>}
            </article>
          </li>
        ))}
      </ul>

      {sliding && (
        <div className="mt-5 flex justify-center gap-1.5">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels.page.replace("{n}", String(i + 1))}
              aria-current={i === page ? "true" : undefined}
              onClick={() => go(i)}
              className={cn(
                "h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink",
                i === page ? "w-6 bg-site-gold" : "w-2.5 bg-slate-300 hover:bg-brand-ink/60",
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
