import {
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Fingerprint,
  Globe,
  GraduationCap,
  IdCard,
  Languages,
  Megaphone,
  MessageSquareText,
  NotebookPen,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Ticket,
  UserCheck,
  Users,
  Wallet,
  BellRing,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type messages from "@/messages/en.json";
import { MarginHeading, MarginRow, Note } from "./Margin";

type Copy = (typeof messages)["marketing"]["features"];

// every feature, by the part of the institution it serves (marketing.features.items.* keys)
const GROUPS: { key: keyof Copy["groups"]; items: [keyof Copy["items"], LucideIcon][] }[] = [
  {
    key: "students",
    items: [
      ["students", GraduationCap],
      ["teachers", Users],
      ["routine", CalendarDays],
      ["calendar", CalendarRange],
      ["promotion", TrendingUp],
      ["idCards", IdCard],
    ],
  },
  {
    key: "attendance",
    items: [
      ["classAttendance", ClipboardCheck],
      ["devices", Fingerprint],
      ["teacherAttendance", UserCheck],
      ["absentSms", BellRing],
    ],
  },
  {
    key: "exams",
    items: [
      ["exams", ClipboardList],
      ["marks", BookOpenCheck],
      ["results", BadgeCheck],
      ["admitCards", Ticket],
    ],
  },
  {
    key: "fees",
    items: [
      ["feeSetup", Wallet],
      ["receipts", ReceiptText],
      ["onlinePayment", CreditCard],
      ["accounts", PiggyBank],
    ],
  },
  {
    key: "guardians",
    items: [
      ["sms", MessageSquareText],
      ["notices", Megaphone],
      ["homework", NotebookPen],
      ["app", Smartphone],
    ],
  },
  {
    key: "online",
    items: [
      ["website", Globe],
      ["roles", ShieldCheck],
      ["bangla", Languages],
    ],
  },
];

/*
 * Every feature of the platform, on the classroom's chalkboard: the parts of the institution in
 * the margin in chalk yellow, and each part's features to the right, an icon, a name and one line.
 */
export async function Features() {
  const t = await getTranslations("marketing.features");

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16 bg-mk-board [--mk-line:rgb(255_255_255/0.22)]">
      <MarginRow className="h-20 sm:h-28" />
      <MarginRow note={<Note className="text-white/65 max-lg:mb-4 lg:pt-3">{t("eyebrow")}</Note>}>
        <MarginHeading light id="features-title" title={t("title")} subtitle={t("subtitle")} />
      </MarginRow>
      <MarginRow className="h-8 sm:h-12" />

      {GROUPS.map((group, i) => (
        <MarginRow
          key={group.key}
          note={<h3 className="pt-8 text-xl leading-snug text-mk-chalk max-lg:mb-5 lg:pt-10">{t(`groups.${group.key}`)}</h3>}
          className="max-lg:pt-0 lg:pt-10"
        >
          <ul
            className={cn(
              // three across, or two across for a group of four (no feature left alone on a row)
              "grid gap-x-10 gap-y-7 pb-10 sm:grid-cols-2",
              group.items.length !== 4 && "xl:grid-cols-3",
              i < GROUPS.length - 1 && "border-b border-dashed border-white/20",
            )}
          >
            {group.items.map(([key, Icon]) => (
              <li key={key} className="flex gap-4">
                <Icon aria-hidden className="mt-1 size-5 shrink-0 text-mk-chalk" strokeWidth={1.75} />
                <div>
                  <p className="text-lg font-semibold text-white">{t(`items.${key}.title`)}</p>
                  <p className="mt-1 text-base leading-relaxed text-white/72">{t(`items.${key}.body`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </MarginRow>
      ))}
      <MarginRow className="h-16 sm:h-24" />
    </section>
  );
}
