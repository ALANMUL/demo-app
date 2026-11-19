import { getTranslations } from "next-intl/server";
import { getPublicNotices } from "@/lib/publicNotices";
import { NoticeBoard } from "./NoticeBoard";

/*
 * The homepage's notices, unnumbered, with a layout of its own: a short gold line and the heading,
 * "View all notices" across from it, and the newest notices as a row of cards on the grey desk.
 */
export async function NoticesSection({ subdomain }: { subdomain: string }) {
  const [t, first] = await Promise.all([getTranslations("schoolHome.notices"), getPublicNotices(subdomain)]);

  return (
    <section id="notices" aria-labelledby="notices-title" className="scroll-mt-16 border-t border-border/70 bg-canvas sm:scroll-mt-22">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <NoticeBoard subdomain={subdomain} first={first} heading={t("title")} headingId="notices-title" />
      </div>
    </section>
  );
}
