"use client";

import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { SchoolSite } from "@/lib/site";

// a swipe shorter than this is a tap
const SWIPE_PX = 40;

// a contact sheet starts with two rows of three; the rest are a click away
const FIRST = 6;

/*
 * The gallery's pictures as a contact sheet: even 4:3 frames with their captions under them,
 * the first six and then "Show all". A picture opens full size in a dark viewer with its caption,
 * arrows, swipes and the arrow keys (through every picture, shown or not yet).
 */
export function GalleryGrid({ photos }: { photos: SchoolSite["gallery"] }) {
  const t = useTranslations("schoolHome.gallery");
  const [all, setAll] = useState(false);
  const shown = all ? photos : photos.slice(0, FIRST);
  const hidden = photos.length - shown.length;
  const [open, setOpen] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const count = photos.length;
  const go = (step: number) => setOpen((i) => (i === null ? i : (i + step + count) % count));

  // the arrow keys move through the pictures while one is open
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- go only reads the count
  }, [open === null, count]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7">
        {shown.map((photo, i) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={photo.caption ? t("openNamed", { caption: photo.caption }) : t("open", { number: i + 1 })}
              className="group block w-full rounded-2xl text-left focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="block rounded-2xl border border-border/70 bg-card p-1 transition-colors group-hover:border-foreground/25">
                {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
                <img src={photo.image} alt={photo.caption ?? ""} loading="lazy" decoding="async" className="aspect-4/3 w-full rounded-xl bg-muted object-cover" />
              </span>
              {photo.caption && (
                <span className="mt-2 line-clamp-2 block px-1 text-sm leading-snug text-foreground/75 group-hover:text-foreground">{photo.caption}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Images className="size-4 text-navy" />
            {t("showAll", { count })}
          </button>
        </div>
      )}

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[100dvh] max-w-[100vw] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-[min(1100px,95vw)]"
          onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStart.current;
            touchStart.current = null;
            if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
          }}
        >
          {current && (
            <figure className="relative flex flex-col items-center">
              <DialogTitle className="sr-only">{current.caption ?? t("open", { number: open! + 1 })}</DialogTitle>
              <DialogDescription className="sr-only">{t("counter", { current: open! + 1, total: count })}</DialogDescription>
              {/* eslint-disable-next-line @next/next/no-img-element -- signed links to private storage */}
              <img
                key={current.id}
                src={current.image}
                alt={current.caption ?? ""}
                className="animate-in fade-in max-h-[80dvh] w-auto max-w-full rounded-lg object-contain shadow-2xl duration-300"
              />
              <figcaption className="mt-4 flex w-full items-center justify-between gap-4 px-2 text-sm text-white">
                <span className="min-w-0 truncate">{current.caption}</span>
                <span className="shrink-0 text-white/70 tabular-nums">{t("counter", { current: open! + 1, total: count })}</span>
              </figcaption>

              {count > 1 && (
                <>
                  <ViewerButton label={t("previous")} onClick={() => go(-1)} className="top-1/2 left-2 -translate-y-1/2 sm:-left-14">
                    <ChevronLeft className="size-5" />
                  </ViewerButton>
                  <ViewerButton label={t("next")} onClick={() => go(1)} className="top-1/2 right-2 -translate-y-1/2 sm:-right-14">
                    <ChevronRight className="size-5" />
                  </ViewerButton>
                </>
              )}
              <ViewerButton label={t("close")} onClick={() => setOpen(null)} className="-top-2 right-2 sm:-top-12 sm:right-0">
                <X className="size-5" />
              </ViewerButton>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ViewerButton({ label, onClick, className, children }: { label: string; onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-slate-900 ${className}`}
    >
      {children}
    </button>
  );
}
