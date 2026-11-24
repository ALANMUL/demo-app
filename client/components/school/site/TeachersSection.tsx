import { getLocale, getTranslations } from "next-intl/server";
import { pickName } from "@/lib/i18n/names";
import type { SiteTeacher } from "@/lib/site";
import { cn } from "@/lib/utils";
import { TeacherSlider } from "./TeacherSlider";
import { siteContainer, siteScrollMargin } from "./siteStyles";

/*
 * The homepage's "Our teachers", right after About: the teachers the
 * school picked in its settings, in its order, as a row of cards that slides (TeacherSlider).
 */
export async function TeachersSection({ teachers }: { teachers: SiteTeacher[] }) {
  const [t, locale] = await Promise.all([getTranslations("schoolHome.teachers"), getLocale()]);

  return (
    <section id="teachers" aria-labelledby="teachers-title" className={cn(siteScrollMargin, "bg-white py-12")}>
      <div className={siteContainer}>
        <TeacherSlider
          label={t("label")}
          heading={t("title")}
          headingId="teachers-title"
          labels={{ previous: t("previous"), next: t("next"), page: t.raw("page") as string }}
          teachers={teachers.map((teacher) => ({
            id: teacher.id,
            name: pickName(teacher, locale),
            designation: teacher.designation?.trim() || null,
            photo: teacher.photo,
          }))}
        />
      </div>
    </section>
  );
}
