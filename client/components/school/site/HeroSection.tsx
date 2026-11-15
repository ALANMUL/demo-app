import { ArrowRight, ChevronRight, MapPin, Megaphone, Phone } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { getPublicNotices, type PublicNoticeItem } from "@/lib/publicNotices";
import { hasAdmission, type SchoolSite } from "@/lib/site";
import { cn } from "@/lib/utils";
import { HeroStage } from "./HeroStage";
import { OpenNoticeButton } from "./NoticeBoard";

// "+8801712345678" -> "01712345678", how people here write it
const localPhone = (phone: string) => phone.replace(/^\+?880/, "0");

// characters past which the name is set a size smaller
const LONG_NAME = 28;

// a focus ring that shows on the school's colour
const focusOnDark = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary";

/*
 * The top of the homepage: the school's photos across the full width, fading one into the next,
 * and over them at the bottom left its name, its own line, the way to admission (or the notices)
 * and contact, and its phone and address. Without slides the about photo or the first gallery
 * photos stand in; without any photo, the school's colour. Under it, a strip with the newest notice.
 */
export async function HeroSection({ school, name }: { school: SchoolSite; name: string }) {
  // the notices section loads the same page; Next keeps one copy of the request
  const [t, notices] = await Promise.all([getTranslations("schoolHome.hero"), getPublicNotices(school.subdomain)]);
  const latest = notices?.items[0];
  const primary = hasAdmission(school.admission)
    ? { href: "#admission", label: t("admission") }
    : { href: "#notices", label: t("notices") };
  const firstAddressLine = school.address?.split("\n")[0];

  // the slides, else the about photo, else up to three gallery photos
  const slides =
    school.slides.length > 0
      ? school.slides
      : school.about.image
        ? [{ id: "about", image: school.about.image, caption: null }]
        : school.gallery.slice(0, 3);

  return (
    <>
      <HeroStage slides={slides} name={name}>
        {/* a long name ("… সরকারি বালিকা উচ্চ বিদ্যালয় ও কলেজ") steps down a size, so it stays within three lines on a phone */}
        <h1
          className={cn(
            "font-bold tracking-[-0.02em] text-balance",
            name.length > LONG_NAME ? "text-[clamp(2rem,4vw,3.5rem)]" : "text-[clamp(2.5rem,5.4vw,4.5rem)]",
            // after the size: tailwind-merge drops a line height that comes before a font size
            "leading-[1.08]",
          )}
        >
          {name}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-white/80 sm:text-lg">{school.about.tagline || t("tagline")}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={primary.href}
            className={`inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 font-semibold text-school-sidebar transition-colors hover:bg-white/90 ${focusOnDark}`}
          >
            {primary.label}
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#contact"
            className={`inline-flex h-12 items-center rounded-md border border-white/60 px-6 font-semibold text-white transition-colors hover:bg-white/10 ${focusOnDark}`}
          >
            {t("contact")}
          </a>
        </div>

        {(school.phone || firstAddressLine) && (
          <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
            {school.phone && (
              <a href={`tel:${school.phone}`} className={`-my-3 inline-flex items-center gap-2 rounded-sm py-3 tabular-nums hover:text-white ${focusOnDark}`}>
                <Phone className="size-4" />
                <span className="sr-only">{t("phone")}: </span>
                {localPhone(school.phone)}
              </a>
            )}
            {school.phone && firstAddressLine && <span aria-hidden className="h-4 w-px bg-white/30" />}
            {firstAddressLine && (
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span className="sr-only">{t("address")}: </span>
                {firstAddressLine}
              </span>
            )}
          </p>
        )}
      </HeroStage>

      {latest && <LatestNotice notice={latest} label={t("latestNotice")} />}
    </>
  );
}

/* The strip under the photos: the newest notice, opening in full on the page. */
async function LatestNotice({ notice, label }: { notice: PublicNoticeItem; label: string }) {
  const format = await getFormatter();
  return (
    <div className="border-b border-border/70 bg-card">
      <OpenNoticeButton
        notice={notice}
        className="group mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:outline-none sm:gap-5"
      >
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-navy">
          <Megaphone className="size-4" />
          <span className="hidden sm:inline">{label}</span>
        </span>
        <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
        <time dateTime={notice.publishAt} className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {format.dateTime(new Date(notice.publishAt), { day: "numeric", month: "short", timeZone: "Asia/Dhaka" })}
        </time>
        <span className="min-w-0 flex-1 truncate font-medium">
          <span className="sr-only sm:hidden">{label}: </span>
          {notice.title}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </OpenNoticeButton>
    </div>
  );
}
