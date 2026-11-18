import { ChevronRight, Megaphone } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { getPublicNotices, type PublicNoticeItem } from "@/lib/publicNotices";
import type { SchoolSite } from "@/lib/site";
import { HeroStage } from "./HeroStage";
import { OpenNoticeButton } from "./NoticeBoard";

/*
 * The top of the homepage: the school's photos at the full size of the screen, fading one into the
 * next, with no words and no shade over them (the name is still the page's heading, for screen
 * readers and search engines). Without slides the about photo or the first gallery photos stand
 * in; without any photo, nothing. Under it, a strip with the newest notice.
 */
export async function HeroSection({ school, name }: { school: SchoolSite; name: string }) {
  // the notices section loads the same page; Next keeps one copy of the request
  const [t, notices] = await Promise.all([getTranslations("schoolHome.hero"), getPublicNotices(school.subdomain)]);
  const latest = notices?.items[0];

  // the slides, else the about photo, else up to three gallery photos
  const slides =
    school.slides.length > 0
      ? school.slides
      : school.about.image
        ? [{ id: "about", image: school.about.image, caption: null }]
        : school.gallery.slice(0, 3);

  return (
    <>
      <h1 className="sr-only">{name}</h1>
      <HeroStage slides={slides} name={name} />

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
