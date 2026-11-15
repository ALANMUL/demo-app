import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnnouncementsPage } from "@/components/school/announcements/AnnouncementsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("announcements");
  return { title: t("title") };
}

// the super admin only: the platform's announcements (the page says so to anyone else; the server refuses them too)
export default function Page() {
  return <AnnouncementsPage />;
}
