import { Merriweather, Plus_Jakarta_Sans } from "next/font/google";

/*
 * The school homepage's English type, as in the agreed mockup: Plus Jakarta Sans for the text and
 * Merriweather for the headings and the school's name (and its italic for the footer line). Neither
 * has Bangla letters, so Bangla falls through to Anek Bangla, as everywhere in the app. Loaded only
 * by the pages that render this (the homepage and the application form); the dashboard keeps its
 * Times New Roman.
 */
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
const serif = Merriweather({ subsets: ["latin"], weight: ["400", "700", "900"], style: ["normal", "italic"], display: "swap" });

/**
 * Sets the fonts for the whole page while a school site is on it (html:has(.site-home)), so the
 * windows it opens (a notice, the gallery, "Learn more"), which sit outside the page's own box,
 * get them too. Headings (h1 to h4) and anything marked .site-serif take the serif.
 */
export function SiteFonts() {
  const css = `
html:has(.site-home) body { font-family: ${sans.style.fontFamily}, var(--font-bangla), ui-sans-serif, system-ui, sans-serif; }
html:has(.site-home) :is(h1, h2, h3, h4, .site-serif) { font-family: ${serif.style.fontFamily}, var(--font-bangla), Georgia, serif; }
`;
  return <style>{css}</style>;
}
