import {
  Ambulance,
  BookOpen,
  Bus,
  Cctv,
  FlaskConical,
  Goal,
  Hotel,
  Laptop,
  Moon,
  MonitorPlay,
  Trophy,
  Utensils,
  type LucideIcon,
} from "lucide-react";

/*
 * The facilities a school can show on its homepage ("Our facilities"), in the order the settings
 * offer them, each with its icon; the names are in messages (schoolHome.facilities.items). The
 * server keeps the same keys (server/src/app/shared/siteFacilities.ts).
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

export const FACILITY_ICONS: Record<SiteFacility, LucideIcon> = {
  library: BookOpen,
  scienceLab: FlaskConical,
  computerLab: Laptop,
  digitalClassroom: MonitorPlay,
  playground: Goal,
  sports: Trophy,
  prayerRoom: Moon,
  medical: Ambulance,
  cctv: Cctv,
  transport: Bus,
  canteen: Utensils,
  hostel: Hotel,
};

// a stored key the app still knows (an old or mistyped one is skipped)
export const isSiteFacility = (key: string): key is SiteFacility => (SITE_FACILITIES as readonly string[]).includes(key);
