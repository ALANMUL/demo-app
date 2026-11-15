"use client";

import { Pause, Play } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";

// how long a photo shows (the marker fills meanwhile), and the hand-over between two photos
const HOLD_MS = 7000;
const FADE_MS = 1200;
// a swipe shorter than this is a tap
const SWIPE_PX = 40;
// a photo that would lose more than this share of itself to fill the stage is shown whole instead
const MAX_CROP = 0.4;

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
 * The homepage's opening: the school's photos across the full width, one fading into the next,
 * with its words (`children`) over them at the bottom left, on a shade of the school's colour.
 * A photo fills the stage; one whose shape would lose too much (a tall poster, or a landscape
 * photo on a phone) is shown whole over a softened copy of itself instead. Along the bottom: the
 * caption, "02 / 05", a marker per photo (filling while it shows) and pause/play. Pointing at or
 * focusing the controls holds the photo; arrows and swipes move on. Photos that fail to load are
 * left out; without any, the words alone on the school's colour.
 */
export function HeroStage({ slides: all, name, children }: { slides: Slide[]; name: string; children: ReactNode }) {
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

  return (
    <section
      ref={stage}
      className="dark relative isolate overflow-hidden bg-school-sidebar text-white"
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > SWIPE_PX) go(current + (dx < 0 ? 1 : -1));
      }}
    >
      {count > 0 && (
        <>
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
                    <img src={src} alt="" decoding="async" className="absolute inset-0 size-full scale-110 object-cover blur-2xl brightness-90" />
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
                      // whole: near the top on a phone (the words are below), to the right beside them on a desktop
                      whole ? "object-contain object-[50%_8%] lg:object-[88%_50%]" : "object-cover",
                    )}
                  />
                </div>
              );
            })}
          </div>
          <div aria-hidden className="hero-scrim absolute inset-0 z-3" />
        </>
      )}

      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4",
          count > 0
            ? // the whole screen under the header bar (64px, 72px from 640px)
              "min-h-[calc(100svh-4rem)] pt-28 pb-5 sm:min-h-[calc(100svh-4.5rem)] sm:pt-16 sm:pb-6 lg:pt-16 lg:pb-8"
            : "py-14 sm:py-20 lg:py-24",
        )}
      >
        <div className={cn("min-w-0 [text-shadow:0_1px_3px_rgb(0_0_0/0.45)]", count > 0 ? "max-w-2xl" : "max-w-4xl")}>{children}</div>

        {(caption || count > 1) && (
          <div
            role="group"
            aria-label={t("label", { name })}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-white/20 pt-3 lg:mt-12"
            onKeyDown={onKeyDown}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={() => setHeld(false)}
          >
            {caption && (
              <p key={slides[current].id} className="min-w-0 flex-1 basis-full animate-in text-sm leading-snug text-white/85 duration-700 fade-in sm:basis-0">
                {caption}
              </p>
            )}
            {count > 1 && (
              <div className={cn("flex items-center gap-3", caption ? "w-full sm:w-auto" : "w-full sm:ml-auto sm:w-auto")}>
                <span className="shrink-0 text-sm text-white/85 tabular-nums" aria-live={announce ? "polite" : "off"}>
                  <span className="sr-only">{t("slideOf", { current: current + 1, total: count })}</span>
                  <span aria-hidden>
                    {two(current + 1)} <span className="text-white/50">/</span> {two(count)}
                  </span>
                </span>
                {/* a marker per photo: past ones full, the current one filling */}
                <div className="flex flex-1 gap-1.5 sm:w-48 sm:flex-none">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={t("goTo", { number: i + 1 })}
                      aria-current={i === current}
                      className="group/bar relative h-11 flex-1 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-0.75 -translate-y-1/2 overflow-hidden rounded-full bg-white/30 group-hover/bar:bg-white/50">
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
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary"
                  >
                    {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
