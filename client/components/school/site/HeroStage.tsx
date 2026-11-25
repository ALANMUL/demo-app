"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { siteContainer, siteFocus } from "./siteStyles";

// how long a photo shows before the next slides in, and how long the slide takes
const HOLD_MS = 6000;
const SLIDE_MS = 600;
// the space between two cards
const GAP_PX = 24;
// a swipe shorter than this is a tap
const SWIPE_PX = 40;

type Slide = SchoolSite["slides"][number];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
};

/*
 * The homepage's opening, as in the reference: on white that warms to a pale blue at the right, with a
 * soft wave at the bottom left, the words (`children`) on the left and the school's photos on the
 * right as a row of framed cards (white edge, rounded, soft shadow) that slides one card at a time.
 * The card in view fills the right column; the next one peeks in past the column, out to the edge of
 * the window. Round white arrows sit on the card's left and right edges; a dot per photo sits under
 * the words (under the cards on a phone). The row turns by itself, held while pointed at, focused or
 * scrolled away, and not at all when the visitor asks for less motion. Photos that fail to load are
 * left out; without any, the words alone.
 */
export function HeroStage({ slides: all, name, children }: { slides: Slide[]; name: string; children: ReactNode }) {
  const t = useTranslations("schoolHome.slider");
  const [failed, setFailed] = useState<string[]>([]);
  const slides = all.filter((slide) => !failed.includes(slide.id));
  const count = slides.length;

  // the card in view: 0..count, where count is the copy of the first card after the last (so the
  // row runs on from the last photo to the first, then quietly jumps back)
  const [position, setPosition] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [held, setHeld] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  // only a change the visitor made is read out; the row turning by itself stays quiet
  const [announce, setAnnounce] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<number | null>(null);
  const stage = useRef<HTMLElement>(null);
  const column = useRef<HTMLDivElement>(null);
  // a card is as wide as the right column (measured, since the row itself runs past it)
  const [cardWidth, setCardWidth] = useState(0);

  const current = count > 0 ? position % count : 0;
  const still = count < 2 || reducedMotion;

  useLayoutEffect(() => {
    const el = column.current;
    if (!el) return;
    const measure = () => setCardWidth(el.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (to: number, byVisitor = true) => {
      if (count < 2) return;
      setAnnounce(byVisitor);
      setAnimate(!reducedMotion);
      if (to < 0) {
        // back from the first card: jump to the copy of it at the end, then slide back one
        setAnimate(false);
        setPosition(count);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimate(!reducedMotion);
            setPosition(count - 1);
          }),
        );
        return;
      }
      setPosition(Math.min(to, count));
    },
    [count, reducedMotion],
  );

  // past the last card onto the copy of the first: once there, jump back to the real first
  useEffect(() => {
    if (position !== count || count < 2) return;
    const timer = setTimeout(
      () => {
        setAnimate(false);
        setPosition(0);
      },
      animate ? SLIDE_MS : 0,
    );
    return () => clearTimeout(timer);
  }, [position, count, animate]);

  // the next card after a while, unless held (a fresh wait after every change)
  useEffect(() => {
    if (still || held || offscreen) return;
    const timer = setTimeout(() => go(position + 1, false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [still, held, offscreen, position, go]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(position + 1);
    if (e.key === "ArrowLeft") go(position - 1);
  };
  const hold = {
    onKeyDown,
    onMouseEnter: () => setHeld(true),
    onMouseLeave: () => setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: () => setHeld(false),
  };

  // the cards in the row: the photos, then the first again (the next card after the last)
  const cards = count > 1 ? [...slides, slides[0]] : slides;
  const arrow = cn(
    "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-ink shadow-[0_4px_14px_rgb(15_23_42/0.18)] transition hover:bg-brand-ink hover:text-white sm:size-11",
    siteFocus,
  );
  const dots = (className: string) =>
    count > 1 && (
      <div className={cn("items-center gap-2", className)} {...hold}>
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => go(i)}
            aria-label={t("goTo", { number: i + 1 })}
            aria-current={i === current}
            // a 20px target around each 10px dot
            className="group/dot -m-[5px] flex size-5 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-ink"
          >
            <span className={cn("block size-2.5 rounded-full transition-colors", i === current ? "bg-brand-ink" : "bg-slate-300 group-hover/dot:bg-brand-ink/50")} />
          </button>
        ))}
      </div>
    );

  return (
    <section
      ref={stage}
      className="relative isolate overflow-hidden bg-[linear-gradient(90deg,#fff_0%,#fff_42%,var(--color-site-teal)_100%)]"
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > SWIPE_PX) go(position + (dx < 0 ? 1 : -1));
      }}
    >
      {/* the soft wave along the bottom left */}
      <svg aria-hidden viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 left-0 -z-10 h-20 w-full lg:h-28">
        <path d="M0,40 C260,100 560,10 900,60 C1120,92 1300,70 1440,50 L1440,120 L0,120 Z" fill="var(--color-site-teal-line)" opacity="0.45" />
        <path d="M0,72 C280,118 600,48 920,88 C1140,112 1320,96 1440,84 L1440,120 L0,120 Z" fill="var(--color-site-teal)" />
      </svg>

      <div className={cn(siteContainer, "grid items-center gap-8 pt-8 pb-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-20 lg:pt-6 lg:pb-16")}>
        {/* the words, and the dots at the foot of the column from 1024px */}
        <div className="flex min-w-0 flex-col self-stretch">
          <div className="my-auto lg:py-6">{children}</div>
          {dots("mt-8 hidden lg:flex")}
        </div>

        {count > 0 && (
          <div ref={column} role="group" aria-roledescription="carousel" aria-label={t("label", { name })} className="relative min-w-0" {...hold}>
            <span className="sr-only" aria-live={announce ? "polite" : "off"}>
              {t("slideOf", { current: current + 1, total: count })}
            </span>
            {/* the row runs past the column to the window's right edge, so the next card peeks in */}
            <div aria-hidden className="-mr-4 overflow-hidden py-3 pl-3 sm:-mr-6 lg:-mr-[calc((100vw-min(100vw,80rem))/2+2rem)]" style={{ marginLeft: "-0.75rem" }}>
              <div
                className="flex"
                style={{
                  gap: GAP_PX,
                  transform: `translateX(-${position * (cardWidth + GAP_PX)}px)`,
                  transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none",
                }}
              >
                {cards.map((slide, i) => (
                  <figure
                    key={`${slide.id}-${i}`}
                    className="shrink-0 rounded-[16px] bg-white p-1.5 shadow-[0_12px_32px_-12px_rgb(10_74_99/0.35)]"
                    style={{ width: cardWidth || "100%" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
                    <img
                      src={slide.image}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      decoding="async"
                      onError={() => {
                        setFailed((ids) => (ids.includes(slide.id) ? ids : [...ids, slide.id]));
                        setAnimate(false);
                        setPosition(0);
                      }}
                      className="aspect-[10/7] w-full rounded-[12px] bg-slate-100 object-cover"
                    />
                  </figure>
                ))}
              </div>
            </div>

            {count > 1 && (
              <>
                <button type="button" onClick={() => go(position - 1)} aria-label={t("previous")} className={cn(arrow, "left-1 sm:-left-5")}>
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => go(position + 1)} aria-label={t("next")} className={cn(arrow, "right-1 sm:-right-5")}>
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        )}

        {dots("flex lg:hidden")}
      </div>
    </section>
  );
}
