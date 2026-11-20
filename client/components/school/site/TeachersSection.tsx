import { getLocale, getTranslations } from "next-intl/server";
import { pickName } from "@/lib/i18n/names";
import type { SiteTeacher } from "@/lib/site";
import { TeacherSlider } from "./TeacherSlider";

/*
 * The homepage's "Our teachers", right after About and unnumbered like it: the teachers the
 * school picked in its settings, in its order, as a row of cards that slides (TeacherSlider).
 */
export async function TeachersSection({ teachers }: { teachers: SiteTeacher[] }) {
  const [t, locale] = await Promise.all([getTranslations("schoolHome.teachers"), getLocale()]);

  return (
    <section id="teachers" aria-labelledby="teachers-title" className="scroll-mt-16 border-t border-border/70 bg-card sm:scroll-mt-22">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <TeacherSlider
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
