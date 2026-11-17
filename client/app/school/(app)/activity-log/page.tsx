import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ActivityLogPage } from "@/components/school/activityLog/ActivityLogPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("activityLog");
  return { title: t("title") };
}

// the super admin only: the page says so to anyone else (the server refuses them too)
export default function Page() {
  return <ActivityLogPage />;
}
