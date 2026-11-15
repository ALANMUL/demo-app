import { getTranslations } from "next-intl/server";
import type { SchoolSite } from "@/lib/site";
import { Chapter } from "./Chapter";
import { GalleryGrid } from "./GalleryGrid";

/** The homepage's gallery chapter: the school's pictures as a contact sheet, each opening full size. */
export async function GallerySection({ photos, number }: { photos: SchoolSite["gallery"]; number: number }) {
  const t = await getTranslations("schoolHome.gallery");
  return (
    <Chapter id="gallery" number={number} title={t("title")} tone="desk">
      <GalleryGrid photos={photos} />
    </Chapter>
  );
}
