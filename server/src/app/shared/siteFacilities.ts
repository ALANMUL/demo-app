/*
 * The facilities a school can show on its homepage ("Our facilities"), each a key the website
 * draws with its own icon and name (client/lib/siteFacilities.ts keeps the same list, in this order).
 */
export const SITE_FACILITIES = [
  "library",
  "scienceLab",
  "computerLab",
  "digitalClassroom",
  "playground",
  "sports",
  "prayerRoom",
  "medical",
  "cctv",
  "transport",
  "canteen",
  "hostel",
] as const;

export type SiteFacility = (typeof SITE_FACILITIES)[number];
