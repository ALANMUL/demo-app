import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementsList } from "@/components/platform/announcements/AnnouncementsList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("platform.announcements");
  return { title: t("title") };
}

export default function AnnouncementsPage() {
  return <AnnouncementsList />;
}
