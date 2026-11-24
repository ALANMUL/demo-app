import { getTranslations } from "next-intl/server";
import { getPublicNotices } from "@/lib/publicNotices";
import { cn } from "@/lib/utils";
import { NoticeBoard } from "./NoticeBoard";
import { siteContainer, siteScrollMargin } from "./siteStyles";

/*
 * The homepage's notices, with a layout of its own: a small orange label and the heading,
 * "View all notices" across from it, and the newest notices as a row of cards on the grey desk.
 */
export async function NoticesSection({ subdomain }: { subdomain: string }) {
  const [t, first] = await Promise.all([getTranslations("schoolHome.notices"), getPublicNotices(subdomain)]);

  return (
    <section id="notices" aria-labelledby="notices-title" className={cn(siteScrollMargin, "bg-white py-12")}>
      <div className={siteContainer}>
        <NoticeBoard subdomain={subdomain} first={first} label={t("label")} heading={t("title")} headingId="notices-title" />
      </div>
    </section>
  );
}
