"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarDays, ChevronDown, ChevronRight, ClipboardList, Eye, Megaphone, Paperclip, PartyPopper, Pin, ReceiptText, TriangleAlert } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import { NoticeText } from "@/components/school/notices/NoticeText";
import { AttachmentList, CategoryBadge } from "@/components/school/notices/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { publicSchoolRoutes } from "@/lib/auth/routes";
import { fetchPublicNotice, fetchPublicNotices, type PublicNotice, type PublicNoticeItem, type PublicNoticePage } from "@/lib/publicNotices";
import type { NoticeCategory } from "@/lib/school/noticeKinds";

type Opened = { id: string; preview?: PublicNoticeItem };

// another part of the page (the hero's "latest notice" card) asks the board to open a notice
const OPEN_NOTICE_EVENT = "school-site:open-notice";
type OpenNoticeDetail = { notice: PublicNoticeItem };

/** A button anywhere on the homepage that opens a notice in the board's dialog. */
export function OpenNoticeButton({ notice, className, children }: { notice: PublicNoticeItem; className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent<OpenNoticeDetail>(OPEN_NOTICE_EVENT, { detail: { notice } }))}
    >
      {children}
    </button>
  );
}

// cards on the page; the rest are behind "View all notices"
const CARDS = 3;

const CATEGORY_ICONS: Record<NoticeCategory, LucideIcon> = {
  GENERAL: Megaphone,
  EXAM: ClipboardList,
  HOLIDAY: CalendarDays,
  FEES: ReceiptText,
  EVENT: PartyPopper,
  URGENT: TriangleAlert,
};

/*
 * The homepage's notices: a short gold line and the heading with "View all notices" across from it,
 * then the newest three as cards (the date in a box of the accent's tint, the title, the start of
 * the text, "View", and the category's icon). "View" opens the notice in full in a dialog; "View all
 * notices" lists them all in another, a page at a time ("Show more"). The open notice is in the
 * address ("/?notice=<id>"), so it can be shared and old notice board links (sent here by the
 * middleware) open it.
 */
export function NoticeBoard({
  subdomain,
  first,
  heading,
  headingId,
}: {
  subdomain: string;
  first: PublicNoticePage | null;
  heading: string;
  headingId: string;
}) {
  const t = useTranslations("schoolHome.notices");
  const [items, setItems] = useState(first?.items ?? []);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  const [opened, setOpened] = useState<Opened | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const totalPages = first?.meta.totalPages ?? 0;
  const total = first?.meta.total ?? 0;

  // a notice named in the address opens on arrival
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("notice");
    if (id) setOpened({ id: id.slice(0, 64), preview: first?.items.find((n) => n.id === id) });
  }, [first]);

  const open = (notice: PublicNoticeItem) => {
    setOpened({ id: notice.id, preview: notice });
    history.replaceState(null, "", `/?${new URLSearchParams({ notice: notice.id })}`);
  };

  useEffect(() => {
    const onOpen = (e: Event) => open((e as CustomEvent<OpenNoticeDetail>).detail.notice);
    window.addEventListener(OPEN_NOTICE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_NOTICE_EVENT, onOpen);
  }, []);

  const close = () => {
    setOpened(null);
    history.replaceState(null, "", publicSchoolRoutes.notices);
  };

  const showMore = async () => {
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const next = await fetchPublicNotices(subdomain, page + 1);
      // a notice published meanwhile shifts the pages: skip any already shown
      setItems((shown) => [...shown, ...next.items.filter((n) => !shown.some((s) => s.id === n.id))]);
      setPage(page + 1);
    } catch {
      setMoreFailed(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 id={headingId} className="flex items-center gap-3 text-[1.5rem] leading-tight font-bold tracking-[-0.015em] text-navy sm:text-[1.75rem]">
          <span aria-hidden className="h-1 w-10 shrink-0 rounded-full bg-sidebar-primary" />
          {heading}
        </h2>
        {total > CARDS && (
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="-my-2 inline-flex items-center gap-1.5 rounded-sm py-2 text-sm font-semibold text-navy underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-6 flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-5 py-6 text-muted-foreground">
          <Megaphone className="size-5 shrink-0 text-muted-foreground/60" />
          {t("empty")}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, CARDS).map((n) => (
            <li key={n.id} className="min-w-0">
              <NoticeCard notice={n} onOpen={() => open(n)} />
            </li>
          ))}
        </ul>
      )}

      {/* every notice, a page at a time; one opens on top of the list */}
      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="border-b pb-4 text-left">
            <DialogTitle className="text-xl leading-snug text-navy">{t("allTitle")}</DialogTitle>
            <DialogDescription className="sr-only">{heading}</DialogDescription>
          </DialogHeader>
          <ul className="-mt-2 divide-y divide-border/70">
            {items.map((n) => (
              <li key={n.id}>
                <NoticeRow notice={n} onOpen={() => open(n)} />
              </li>
            ))}
          </ul>
          {page < totalPages && (
            <div className="flex flex-col items-start gap-2">
              <Button variant="outline" onClick={showMore} disabled={loadingMore} className="border-brand/30 text-navy hover:bg-brand-soft hover:text-navy">
                <ChevronDown /> {loadingMore ? t("loading") : t("showMore")}
              </Button>
              {moreFailed && <p className="text-xs text-destructive">{t("loadFailed")}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <NoticeDialog subdomain={subdomain} opened={opened} onClose={close} />
    </>
  );
}

const useDay = (iso: string) => {
  const format = useFormatter();
  return (opts: { day?: "numeric"; month?: "short"; year?: "numeric" }) => format.dateTime(new Date(iso), { ...opts, timeZone: "Asia/Dhaka" });
};

/* One notice on the page: its date in a box, the title, the start of the text and "View". */
function NoticeCard({ notice: n, onOpen }: { notice: PublicNoticeItem; onOpen: () => void }) {
  const t = useTranslations("schoolHome.notices");
  const tCategory = useTranslations("school.notices.categories");
  const day = useDay(n.publishAt);
  const Icon = CATEGORY_ICONS[n.category];

  return (
    <article className="group relative flex h-full gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-shadow focus-within:shadow-[0_10px_28px_-14px_rgb(15_23_42/0.3)] hover:shadow-[0_10px_28px_-14px_rgb(15_23_42/0.3)] sm:p-5">
      <time
        dateTime={n.publishAt}
        className="flex w-16 shrink-0 flex-col items-center self-start rounded-xl bg-brand-soft px-1 py-2.5 text-center text-navy tabular-nums"
      >
        <span className="text-[1.75rem] leading-none font-bold">{day({ day: "numeric" })}</span>
        <span className="mt-1.5 text-xs font-semibold">{day({ month: "short" })}</span>
        <span className="text-xs opacity-75">{day({ year: "numeric" })}</span>
      </time>
      {/* a short, light rule between the date and the words, centred on the date */}
      <span aria-hidden className="mt-4.5 h-14 w-px shrink-0 self-start bg-border" />

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-2 pr-9 text-base leading-snug font-bold text-navy text-pretty">{n.title}</h3>
        {n.excerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground">
          {/* the whole card opens the notice, through this button */}
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 group-hover:underline after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
          >
            <Eye className="size-4" />
            {t("view")}
          </button>
          {n.pinned && (
            <span className="inline-flex items-center gap-1">
              <Pin className="size-3.5" /> {t("pinned")}
            </span>
          )}
          {n.attachmentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3.5" /> {t("files", { count: n.attachmentCount })}
            </span>
          )}
        </div>
      </div>

      {/* what kind of notice it is */}
      <span className="pointer-events-none absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-navy/80 sm:top-5 sm:right-5">
        <Icon aria-hidden className="size-5" />
        <span className="sr-only">{tCategory(n.category)}</span>
      </span>
    </article>
  );
}

/* One notice in the "View all notices" list: the date, the title and what it is. */
function NoticeRow({ notice: n, onOpen }: { notice: PublicNoticeItem; onOpen: () => void }) {
  const t = useTranslations("schoolHome.notices");
  const day = useDay(n.publishAt);

  return (
    // a dated line of the notice book: the day large in the margin, the title, then what it is
    <button
      type="button"
      onClick={onOpen}
      className="group grid w-full grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-md px-1 py-3.5 text-left transition-colors hover:bg-brand-soft/60 focus-visible:bg-brand-soft focus-visible:outline-none sm:px-2"
    >
      <time dateTime={n.publishAt} className="flex flex-col border-r border-border/70 pr-3 sm:pr-5">
        <span className="text-[1.75rem] leading-none font-normal text-navy tabular-nums">{day({ day: "numeric" })}</span>
        <span className="mt-1 text-xs text-muted-foreground tabular-nums">
          {day({ month: "short" })} {day({ year: "numeric" })}
        </span>
      </time>
      {/* spans, not a heading and divs: a button may only hold phrasing content */}
      <span className="block min-w-0 space-y-1.5">
        <span className="block text-base leading-snug font-semibold text-pretty group-hover:underline group-hover:underline-offset-4">{n.title}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <CategoryBadge category={n.category} />
          {n.pinned && (
            <span className="inline-flex items-center gap-1">
              <Pin className="size-3.5" /> {t("pinned")}
            </span>
          )}
          {n.attachmentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3.5" /> {t("files", { count: n.attachmentCount })}
            </span>
          )}
        </span>
      </span>
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* One notice in full. What the list already knows shows at once; the text and files load. */
function NoticeDialog({ subdomain, opened, onClose }: { subdomain: string; opened: Opened | null; onClose: () => void }) {
  const t = useTranslations("schoolHome.notices");
  const format = useFormatter();
  const [notice, setNotice] = useState<PublicNotice | null>(null);
  const [failed, setFailed] = useState(false);
  const id = opened?.id;

  useEffect(() => {
    if (!id) return;
    let current = true;
    setNotice(null);
    setFailed(false);
    fetchPublicNotice(subdomain, id)
      .then((n) => current && setNotice(n))
      .catch(() => current && setFailed(true));
    return () => {
      current = false;
    };
  }, [subdomain, id]);

  const head = notice ?? opened?.preview;
  const when = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "long", timeZone: "Asia/Dhaka" });

  return (
    <Dialog open={!!opened} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-2 border-b pb-4 text-left">
          {head && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <CategoryBadge category={head.category} />
              {head.pinned && (
                <span className="inline-flex items-center gap-1">
                  <Pin className="size-3.5" /> {t("pinned")}
                </span>
              )}
            </div>
          )}
          <DialogTitle className="text-xl leading-snug text-navy">
            {/* a span, not Skeleton's div: the title is a heading */}
            {head ? head.title : failed ? t("notFound") : <span className="block h-6 w-2/3 animate-pulse rounded-md bg-muted" />}
          </DialogTitle>
          {head ? (
            <DialogDescription>
              <time dateTime={head.publishAt}>{t("posted", { date: when(head.publishAt) })}</time>
              {head.expiresAt && ` · ${t("until", { date: when(head.expiresAt) })}`}
            </DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{t("title")}</DialogDescription>
          )}
        </DialogHeader>

        {notice ? (
          <div className="space-y-5">
            <NoticeText body={notice.body} className="text-[17px]" />
            <AttachmentList attachments={notice.attachments} />
          </div>
        ) : failed ? (
          <p className="text-sm text-muted-foreground">{t("notFoundHint")}</p>
        ) : (
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
