import { cache } from "react";

/*
 * Server only: a school's public details (name, logo, language), for its
 * login page, its default language and "school not found". Cached for a
 * minute, so a language change in the school's settings shows within 60s.
 */

export type SchoolSite = {
  nameEn: string;
  nameBn: string | null;
  subdomain: string;
  language: "EN" | "BN";
  logo: string | null;
  favicon: string | null;
  // the school's accent and sidebar colours (lib/theme/accents.ts); null = the defaults
  accentColor: string | null;
  sidebarColor: string | null;
  // for the public homepage's contacts: the school's public email, or else its super admin's email
  publicEmail: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  // the homepage's image slider, in order (signed links)
  slides: { id: string; image: string; caption: string | null }[];
  // the homepage's admission section; all empty = no section
  admission: Admission;
  // the homepage's about section; all empty = no section
  about: About;
  // the homepage's gallery; empty = no section
  gallery: { id: string; image: string; caption: string | null }[];
};

export type Admission = {
  requirements: string[];
  dates: { label: string; value: string }[];
  // whole taka
  fees: { label: string; amount: number }[];
};

export const hasAdmission = (a: Admission) => a.requirements.length + a.dates.length + a.fees.length > 0;

export type About = {
  body: string;
  image: string | null;
  facts: { label: string; value: string }[];
  // the homepage's line under the school's name, and its footer line; "" = the default lines
  tagline: string;
  footerNote: string;
  // the principal's message beside the about text ("" = none), their name, title ("" = the app's
  // word) and photo (a signed link)
  principalMessage: string;
  principalName: string;
  principalTitle: string;
  principalPhoto: string | null;
  // the school's pages elsewhere, as icons in the homepage's footer; "" = no icon
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
};

// the school's pages elsewhere (the footer's icons), in the order they show
export const SOCIAL_KEYS = ["facebookUrl", "youtubeUrl", "instagramUrl"] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

// a chapter needs words, facts or the principal's message: a picture alone isn't one (without
// slides it opens the homepage instead)
export const hasAbout = (a: About) => a.body.trim().length > 0 || a.facts.length > 0 || a.principalMessage.trim().length > 0;

export type SiteChapter = "about" | "admission" | "notices" | "gallery" | "contact";

/**
 * The homepage's chapters in page order, leaving out those the school hasn't filled in (notices
 * and contact always show). The menu, the chapter numbers and the footer all follow this list.
 */
export const siteChapters = (school: Pick<SchoolSite, "about" | "admission" | "gallery">): SiteChapter[] => [
  ...(hasAbout(school.about) ? (["about"] as const) : []),
  ...(hasAdmission(school.admission) ? (["admission"] as const) : []),
  "notices",
  ...(school.gallery.length > 0 ? (["gallery"] as const) : []),
  "contact",
];

const API_URL = process.env.API_URL ?? "http://localhost:5000";

/** The active school on this subdomain, or null if there is none. */
export const getSchoolSite = cache(async (subdomain: string): Promise<SchoolSite | null> => {
  // never cached: its picture links are signed and expire within two hours, and a cached copy is
  // served however old it is (refreshed only behind it), so a quiet site would show dead pictures
  const res = await fetch(`${API_URL}/api/v1/school/site/${encodeURIComponent(subdomain)}`, { cache: "no-store" });

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Loading school "${subdomain}" failed with ${res.status}`);

  return ((await res.json()) as { data: SchoolSite }).data;
});
