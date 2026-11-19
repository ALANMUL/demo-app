"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

// the drawing's own width (33rem); it is drawn at this width and zoomed to fit
const DRAWN_WIDTH = 528;
// never smaller than this: below it the words in the drawing get too small to read
const MIN_ZOOM = 0.5;
// the space kept under the drawing, above the hero's end (the hero's smallest top and bottom gaps, 16px on a short window)
const GAP_BELOW = 16;
// how far it may rise beside the headline, and the space it keeps from the headline's words
// (beside them, and below them)
const MAX_RISE = 72;
const CLEARANCE_X = 24;
const CLEARANCE_Y = 16;

/*
 * The hero's dashboard drawing, zoomed (zoom, so the space it takes shrinks with it) to fit both
 * its column and the screen: where it sits beside the words (from 1024px), as wide as its column
 * at most, and short enough to end above the bottom of the window, whatever the window's height
 * (a laptop's browser leaves ~640px of a 768px screen). It also rises a little into the empty
 * paper beside the headline (never onto its words), which gives it more room. Measured again when the window changes
 * size and once the fonts are in. Below 1024px it sits under the words at its column's width.
 * Before this runs, the CSS guess on the wrapper (zoom by width) keeps it close.
 */
export function FitDashboard({ children, className }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = outer.current;
    const drawing = inner.current;
    const hero = box?.closest("section");
    const title = hero?.querySelector("h1");
    if (!box || !drawing || !hero || !title) return;
    const beside = window.matchMedia("(min-width: 64rem)");

    const fit = () => {
      if (!beside.matches) {
        drawing.style.zoom = "";
        drawing.style.width = "";
        return;
      }
      // its natural size, at its own width, in its own place
      box.style.marginTop = "";
      drawing.style.width = `${DRAWN_WIDTH}px`;
      drawing.style.zoom = "1";
      const height = drawing.offsetHeight;

      const column = box.getBoundingClientRect();
      const titleTop = title.getBoundingClientRect().top;
      const range = document.createRange();
      range.selectNodeContents(title);
      const lines = [...range.getClientRects()].filter((line) => line.width > 0);
      // the hero fills the window under the header
      const screen = window.innerHeight - hero.offsetTop;

      // how big it can be when it starts `rise` px higher: as wide as its column at most, and
      // ending above the window's bottom (the drawing starts this far below the headline)
      const zoomFor = (rise: number) => {
        const room = screen - (column.top - rise - titleTop) - GAP_BELOW * 2;
        return Math.max(MIN_ZOOM, Math.min(1, column.width / DRAWN_WIDTH, room / height));
      };
      // how far it can rise into the empty paper beside the headline when its left edge is at
      // `left` (it sits at the right of its column): up to MAX_RISE, staying CLEARANCE_Y below
      // every line of the headline that comes within CLEARANCE_X of it
      const riseFor = (left: number) =>
        Math.max(
          0,
          lines.reduce((rise, line) => (line.right > left - CLEARANCE_X ? Math.min(rise, column.top - line.bottom - CLEARANCE_Y) : rise), MAX_RISE),
        );
      const leftAt = (zoom: number) => column.right - DRAWN_WIDTH * zoom;

      // rising lets it grow, but growing widens it to the left, towards the headline: take the
      // biggest size whose rise (beside the headline's words, never under them) leaves it room
      let zoom = MIN_ZOOM;
      let rise = riseFor(leftAt(MIN_ZOOM));
      for (let z = Math.min(1, column.width / DRAWN_WIDTH); z > MIN_ZOOM; z -= 0.01) {
        const r = riseFor(leftAt(z));
        if (zoomFor(r) >= z) {
          zoom = z;
          rise = r;
          break;
        }
      }

      if (rise > 0) box.style.marginTop = `${-Math.round(rise)}px`;
      drawing.style.zoom = String(Math.floor(zoom * 1000) / 1000);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    window.addEventListener("resize", fit);
    void document.fonts?.ready.then(fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="ml-auto lg:w-[33rem] lg:[zoom:var(--fit-guess,1)]">
        {children}
      </div>
    </div>
  );
}
