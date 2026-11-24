"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { siteContainer, siteFocus } from "./siteStyles";

// how long a photo shows, and the hand-over between two photos
const HOLD_MS = 6000;
const FADE_MS = 1200;
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
 * The homepage's opening: the school's photos across the whole width, one fading into the next,
 * under a white veil that is solid on the left and clears to the right (from the top down on a
 * phone), so the words (`children`: the school's line, name, tagline and buttons) sit on white and
 * the photo shows beside them. At the bottom right, from 640px: the caption in a white pill and
 * round previous / pause / next buttons. Under the stage, on a soft wave, a dot per photo (with
 * pause on a phone). Pointing at or focusing the controls holds the photo; arrows and swipes move
 * on. Photos that fail to load are left out; without any, the words on white.
 */
export function HeroStage({ slides: all, name, children }: { slides: Slide[]; name: string; children: ReactNode }) {
  const t = useTranslations("schoolHome.slider");
  const [failed, setFailed] = useState<string[]>([]);
  const slides = all.filter((slide) => !failed.includes(slide.id));
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [held, setHeld] = useState(false);
  // scrolled out of view: nothing moves (and nothing is spent) until it is back
  const [offscreen, setOffscreen] = useState(false);
  // only a change the visitor made is read out; the slideshow turning by itself stays quiet
  const [announce, setAnnounce] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<number | null>(null);
  const stage = useRef<HTMLElement>(null);

  const current = Math.min(index, Math.max(count - 1, 0));
  // with one photo, or less motion asked for, nothing moves by itself
  const still = count < 2 || reducedMotion;
  const paused = userPaused || held || offscreen;

  // photos are fetched as they come up (the one showing and the next), not all at once: on a
  // phone with slow data the first one gets the whole connection
  const [fetched, setFetched] = useState<string[]>(() => (all[0] ? [all[0].id] : []));
  const currentId = slides[current]?.id;
  const nextId = count > 1 ? slides[(current + 1) % count].id : undefined;
  useEffect(() => {
    const ids = [currentId, nextId].filter((id): id is string => !!id);
    const timer = setTimeout(() => setFetched((had) => (ids.every((id) => had.includes(id)) ? had : [...new Set([...had, ...ids])])), 1500);
    return () => clearTimeout(timer);
  }, [currentId, nextId]);

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
      const next = ((to % count) + count) % count;
      if (next === current) return;
      setAnnounce(byVisitor);
      // a photo asked for directly is fetched straight away
      setFetched((had) => (had.includes(slides[next].id) ? had : [...had, slides[next].id]));
      setLeaving(current);
      setIndex(next);
    },
    [count, current, slides],
  );

  // the next photo after a while, unless held or paused (a fresh wait after every change)
  useEffect(() => {
    if (still || paused) return;
    const timer = setTimeout(() => go(current + 1, false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [still, paused, current, go]);

  // the photo before goes once it has fully faded out
  useEffect(() => {
    if (leaving === null) return;
    const timer = setTimeout(() => setLeaving(null), FADE_MS + 100);
    return () => clearTimeout(timer);
  }, [leaving, current]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  };
  const hold = {
    onKeyDown,
    onMouseEnter: () => setHeld(true),
    onMouseLeave: () => setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: () => setHeld(false),
  };

  const caption = count > 0 ? slides[current].caption : null;
  const round = cn(
    "flex size-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-brand-ink shadow-md transition hover:bg-brand-ink hover:text-white",
    siteFocus,
  );
  const pauseButton = (className?: string) =>
    !still && (
      <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? t("play") : t("pause")} className={cn(round, className)}>
        {userPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
      </button>
    );

  return (
    <section
      ref={stage}
      className="relative isolate overflow-hidden bg-white"
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > SWIPE_PX) go(current + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="relative flex min-h-[500px] items-center lg:min-h-[560px]">
        {count > 0 && (
          // the photos, one fading into the next, under the white veil
          <div aria-hidden className="absolute inset-0 -z-10">
            {slides.map((slide, i) => {
              const src = i === current || i === leaving || fetched.includes(slide.id) ? slide.image : undefined;
              return (
                <div key={slide.id} className="hero-slide absolute inset-0" data-state={i === current ? "active" : i === leaving ? "leaving" : "idle"}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
                  <img
                    src={src}
                    alt=""
                    fetchPriority={i === 0 ? "high" : "auto"}
                    decoding="async"
                    onError={() => {
                      setFailed((ids) => [...ids, slide.id]);
                      setIndex(0);
                      setLeaving(null);
                    }}
                    className="size-full object-cover object-center"
                  />
                </div>
              );
            })}
            <div className="hero-veil absolute inset-0 z-3" />
          </div>
        )}

        {/* the words: on the veil's solid white at the left */}
        <div className={cn(siteContainer, "relative z-10 w-full py-14 lg:py-20")}>
          <div className="max-w-xl">{children}</div>
        </div>

        {/* the caption and the buttons, at the bottom right */}
        {(caption || count > 1) && (
          <div role="group" aria-label={t("label", { name })} className="absolute right-8 bottom-10 z-20 hidden items-center gap-2.5 sm:flex" {...hold}>
            {caption && (
              <p key={slides[current].id} className="mr-1 max-w-72 animate-in truncate rounded-full border border-slate-100 bg-white/90 px-3.5 py-2 text-xs font-semibold text-brand-ink shadow-sm backdrop-blur-sm duration-700 fade-in">
                {caption}
              </p>
            )}
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(current - 1)} aria-label={t("previous")} className={round}>
                  <ChevronLeft className="size-3" />
                </button>
                {pauseButton()}
                <button type="button" onClick={() => go(current + 1)} aria-label={t("next")} className={round}>
                  <ChevronRight className="size-3" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* a soft wave under the stage, with a dot per photo */}
      <div className="relative bg-white pb-4">
        <svg aria-hidden viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="pointer-events-none relative z-10 -mt-6 h-8 w-full sm:h-12">
          <path d="M0,20 C480,65 960,-15 1440,30 L1440,60 L0,60 Z" fill="var(--color-site-ice)" opacity="0.6" />
          <path d="M0,35 C420,0 1020,65 1440,20" stroke="var(--color-site-line)" strokeWidth="2" fill="none" />
        </svg>
        {count > 1 && (
          <div className={cn(siteContainer, "relative z-20 -mt-2 flex items-center")} {...hold}>
            <span className="sr-only" aria-live={announce ? "polite" : "off"}>
              {t("slideOf", { current: current + 1, total: count })}
            </span>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                aria-label={t("goTo", { number: i + 1 })}
                aria-current={i === current}
                // a 20px target around each 10px dot: 10px apart, as in the mockup
                className="group/dot flex size-5 items-center justify-center rounded-full first:-ml-[5px] focus-visible:outline-2 focus-visible:outline-brand-ink"
              >
                <span
                  className={cn(
                    "block size-2.5 rounded-full transition-all duration-300",
                    i === current ? "scale-110 bg-brand-ink" : "bg-slate-300 group-hover/dot:bg-brand-ink/60",
                  )}
                />
              </button>
            ))}
            {pauseButton("ml-2 size-7 shadow-sm sm:hidden")}
          </div>
        )}
      </div>
    </section>
  );
}
