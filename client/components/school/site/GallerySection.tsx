import { getTranslations } from "next-intl/server";
import type { SchoolSite } from "@/lib/site";
import { SiteSection } from "./SiteSection";
import { GalleryGrid } from "./GalleryGrid";

/** The homepage's gallery: the school's pictures as a contact sheet, each opening full size. */
export async function GallerySection({ photos }: { photos: SchoolSite["gallery"] }) {
  const t = await getTranslations("schoolHome.gallery");
  return (
    <SiteSection id="gallery" label={t("label")} title={t("title")}>
      <GalleryGrid photos={photos} />
    </SiteSection>
  );
}
