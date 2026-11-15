import { getTranslations } from "next-intl/server";
import { getPublicNotices } from "@/lib/publicNotices";
import { Chapter } from "./Chapter";
import { NoticeBoard } from "./NoticeBoard";

/** The homepage's notices chapter: the public notices, newest first, each opening in full on the page. */
export async function NoticesSection({ subdomain, number }: { subdomain: string; number: number }) {
  const [t, first] = await Promise.all([getTranslations("schoolHome.notices"), getPublicNotices(subdomain)]);

  return (
    <Chapter id="notices" number={number} title={t("title")}>
      <NoticeBoard subdomain={subdomain} first={first} />
    </Chapter>
  );
}
