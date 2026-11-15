import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RequirePermission } from "@/components/auth/Can";
import { StudentsList } from "@/components/school/students/StudentsList";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("school.students");
  return { title: t("title") };
}

export default function StudentsPage() {
  return (
    <RequirePermission permission="student:view">
      {/* the list keeps its place in the address (?class=…&page=…) */}
      <Suspense>
        <StudentsList />
      </Suspense> 
    </RequirePermission>
  );
}
