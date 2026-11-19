"use client";

import { Pause, Play } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";

// how long a photo shows (the marker fills meanwhile), and the hand-over between two photos
const HOLD_MS = 7000;
const FADE_MS = 1200;
// a swipe shorter than this is a tap
const SWIPE_PX = 40;
// a photo that would lose more than this share of itself to fill the stage is shown whole instead
// (a tall poster); an ordinary landscape photo fills the width even on a short, wide screen
const MAX_CROP = 0.5;

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
 * The homepage's opening: the school's photos at the full size of the screen (under the header),
 * one fading into the next, with nothing over them but the controls, each on a small dark backing
 * so it reads on any photo: the caption at the bottom left, and "02 / 05", a marker per photo
 * (filling while it shows) and pause/play at the bottom right. A photo fills the stage; one whose
 * shape would lose too much (a tall poster, or a landscape photo on a phone) is shown whole over a
 * softened copy of itself instead. Pointing at or focusing the controls holds the photo; arrows and
 * swipes move on. Photos that fail to load are left out; without any, nothing is shown.
 */
export function HeroStage({ slides: all, name }: { slides: Slide[]; name: string }) {
  const t = useTranslations("schoolHome.slider");
  const format = useFormatter();
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

  // each photo's shape (width / height) once loaded, and the stage's, to tell fill from whole
  const [shapes, setShapes] = useState<Record<string, number>>({});
  const [stageShape, setStageShape] = useState<number | null>(null);
  const measure = useCallback((id: string, img: HTMLImageElement | null) => {
    if (!img?.complete || !img.naturalWidth) return;
    const shape = img.naturalWidth / img.naturalHeight;
    setShapes((had) => (had[id] === shape ? had : { ...had, [id]: shape }));
  }, []);

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
    // the next one a little later, once the showing one has had the connection to itself
    const timer = setTimeout(() => setFetched((had) => (ids.every((id) => had.includes(id)) ? had : [...new Set([...had, ...ids])])), 1500);
    return () => clearTimeout(timer);
  }, [currentId, nextId]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(el);
    const sizer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (height > 0) setStageShape(width / height);
    });
    sizer.observe(el);
    return () => {
      observer.disconnect();
      sizer.disconnect();
    };
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

  // true when filling the stage would cut away more than MAX_CROP of the photo
  const showWhole = (id: string) => {
    const shape = shapes[id];
    if (!shape || !stageShape) return false;
    const kept = shape > stageShape ? stageShape / shape : shape / stageShape;
    return kept < 1 - MAX_CROP;
  };

  const two = (n: number) => format.number(n, { minimumIntegerDigits: 2 });
  const caption = count > 0 ? slides[current].caption : null;

  if (count === 0) return null;

  return (
    <section
      ref={stage}
      // a screen on its side (a computer, a turned tablet or phone): the whole of it under the header
      // (its thin bar and its white bar: 36px + 64px, 40px + 88px from 640px). An upright one (a
      // phone, a tablet): the shape of a photo, 4:3
      // then 16:9, since a wide photo at its full height would be a strip between blurred bands
      className={cn(
        "relative isolate overflow-hidden bg-brand-soft",
        "aspect-4/3 sm:aspect-video",
        "landscape:aspect-auto landscape:h-[calc(100svh-6.25rem)] landscape:min-h-80 sm:landscape:h-[calc(100svh-8rem)]",
      )}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > SWIPE_PX) go(current + (dx < 0 ? 1 : -1));
      }}
    >
      {/* the photos, one fading into the next; each caption is shown as text along the bottom */}
      <div aria-hidden className="absolute inset-0">
        {slides.map((slide, i) => {
          const src = i === current || i === leaving || fetched.includes(slide.id) ? slide.image : undefined;
          const whole = showWhole(slide.id);
          return (
            <div key={slide.id} className="hero-slide absolute inset-0" data-state={i === current ? "active" : i === leaving ? "leaving" : "idle"}>
              {/* a photo shown whole sits over a softened copy of itself, so the stage stays full */}
              {whole && src && (
                // eslint-disable-next-line @next/next/no-img-element -- signed links to private storage
                <img src={src} alt="" decoding="async" className="absolute inset-0 size-full scale-110 object-cover blur-2xl" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
              <img
                ref={(img) => measure(slide.id, img)}
                src={src}
                alt=""
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                onLoad={(e) => measure(slide.id, e.currentTarget)}
                onError={() => {
                  setFailed((ids) => [...ids, slide.id]);
                  setIndex(0);
                  setLeaving(null);
                }}
                className={cn(
                  "relative size-full transition-opacity duration-700",
                  // shown once its shape is known, so it never jumps from filled to whole
                  shapes[slide.id] ? "opacity-100" : "opacity-0",
                  whole ? "object-contain" : "object-cover",
                )}
              />
            </div>
          );
        })}
      </div>

      {(caption || count > 1) && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-2 px-3 pb-3 sm:px-4 sm:pb-5">
            {caption && (
              <p
                key={slides[current].id}
                className="line-clamp-2 max-w-full animate-in rounded-md bg-black/45 px-3 py-1.5 text-sm leading-snug text-white backdrop-blur-sm duration-700 fade-in sm:max-w-md"
              >
                {caption}
              </p>
            )}
            {count > 1 && (
              <div
                role="group"
                aria-label={t("label", { name })}
                className="ml-auto flex items-center gap-3 rounded-full bg-black/40 py-0.5 pr-0.5 pl-4 text-white backdrop-blur-sm"
                onKeyDown={onKeyDown}
                onMouseEnter={() => setHeld(true)}
                onMouseLeave={() => setHeld(false)}
                onFocus={() => setHeld(true)}
                onBlur={() => setHeld(false)}
              >
                <span className="shrink-0 text-sm text-white/90 tabular-nums" aria-live={announce ? "polite" : "off"}>
                  <span className="sr-only">{t("slideOf", { current: current + 1, total: count })}</span>
                  <span aria-hidden>
                    {two(current + 1)} <span className="text-white/55">/</span> {two(count)}
                  </span>
                </span>
                {/* a marker per photo: past ones full, the current one filling */}
                <div className={cn("flex gap-1.5", reducedMotion ? "pr-3" : "", count > 4 ? "w-32 sm:w-48" : "w-24 sm:w-36")}>
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={t("goTo", { number: i + 1 })}
                      aria-current={i === current}
                      className="group/bar relative h-11 flex-1 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-0.75 -translate-y-1/2 overflow-hidden rounded-full bg-white/35 group-hover/bar:bg-white/60">
                        {i < current && <span className="absolute inset-0 bg-white" />}
                        {i === current &&
                          (still ? (
                            <span className="absolute inset-0 bg-white" />
                          ) : (
                            <span
                              key={current}
                              className="slide-progress absolute inset-0 bg-white"
                              data-paused={paused}
                              style={{ "--slide-duration": `${HOLD_MS}ms` } as React.CSSProperties}
                              onAnimationEnd={() => go(current + 1, false)}
                            />
                          ))}
                      </span>
                    </button>
                  ))}
                </div>
                {!reducedMotion && (
                  <button
                    type="button"
                    onClick={() => setUserPaused((p) => !p)}
                    aria-label={userPaused ? t("play") : t("pause")}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                  >
                    {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
