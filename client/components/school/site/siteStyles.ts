/*
 * The school homepage's shared measures, from the agreed mockup (jatrabari_logo_palette.html):
 * a 1280px column with 16 / 24 / 32px gutters, white sections, slate text, the school's deep
 * accent (--brand-ink) where the mockup has its navy, and the accent's pale tint (site-ice) with
 * its edge (site-line) where it has its ice.
 */

// the content column of every band of the page
export const siteContainer = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

// a section's heading under its orange label (Notices, Facilities, Teachers, Admission, Gallery)
export const siteHeading = "text-xl font-bold text-brand-ink sm:text-2xl";

// how far under the sticky 80px header a section lands when the menu jumps to it
export const siteScrollMargin = "scroll-mt-20";

// the ring a control shows when reached by keyboard
export const siteFocus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink";

/**
 * A school's name over two lines, as the mockup sets "Jatrabari Residential / School & College":
 * split at the space nearest the middle, only when it has three words or more.
 */
export const splitName = (name: string): [string, string | null] => {
  const words = name.trim().split(/\s+/);
  if (words.length < 3) return [name.trim(), null];
  let best = 1;
  let bestGap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const gap = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (gap < bestGap) {
      bestGap = gap;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};
