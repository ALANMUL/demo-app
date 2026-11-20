"use client";

import { ArrowDown, ArrowUp, GraduationCap, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useLocalizedName } from "@/lib/i18n/names";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { MAX_SITE_TEACHERS, useSaveSiteTeachers, useSiteTeachers, type SiteTeacherChoice } from "@/lib/school/settings";
import { cn } from "@/lib/utils";

/*
 * The homepage's "Our teachers" row: which of the school's working teachers show, and in what
 * order. The names, designations and photos are the teachers' own (the Teachers page); here a
 * switch puts one on the homepage (at the end of the row) and arrows move it along.
 */
export function SiteTeachersCard() {
  const t = useTranslations("school.settings.siteTeachers");
  const describeError = useErrorMessage();
  const teachers = useSiteTeachers();
  const saved = (teachers.data ?? []).filter((x) => x.siteOrder !== null).map((x) => x.id);

  return (
    <section className="rounded-2xl border border-border/70 bg-card">
      <header className="flex items-center gap-3 border-b px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand">
          <GraduationCap className="size-4" />
        </span>
        <div>
          <h2 className="font-semibold">{t("title")}</h2>
          <p className="text-xs text-muted-foreground">{t("hint")}</p>
        </div>
      </header>
      <div className="p-5">
        {teachers.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : teachers.isError ? (
          <p className="text-sm text-muted-foreground">{describeError(teachers.error)}</p>
        ) : teachers.data.length === 0 ? (
          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground">
            {t("empty")}
            <Button asChild variant="outline" size="sm">
              <Link href="/teachers">{t("openTeachers")}</Link>
            </Button>
          </div>
        ) : (
          // keyed by the saved pick, so a save starts the list afresh
          <PickList key={saved.join(",")} teachers={teachers.data} saved={saved} />
        )}
      </div>
    </section>
  );
}

function PickList({ teachers, saved }: { teachers: SiteTeacherChoice[]; saved: string[] }) {
  const t = useTranslations("school.settings.siteTeachers");
  const name = useLocalizedName();
  const describeError = useErrorMessage();
  const save = useSaveSiteTeachers();
  const [picked, setPicked] = useState(saved);
  const changed = picked.join(",") !== saved.join(",");
  const full = picked.length >= MAX_SITE_TEACHERS;

  const byId = new Map(teachers.map((x) => [x.id, x]));
  // those on the homepage in their order, then the rest as the server sorted them (by name)
  const rows = [...picked.map((id) => byId.get(id)!).filter(Boolean), ...teachers.filter((x) => !picked.includes(x.id))];

  const toggle = (id: string, on: boolean) => setPicked(on ? [...picked, id] : picked.filter((x) => x !== id));
  const move = (from: number, to: number) => {
    const next = [...picked];
    [next[from], next[to]] = [next[to], next[from]];
    setPicked(next);
  };
  const submit = () => save.mutate(picked, { onSuccess: () => toast.success(t("saved")), onError: (e) => toast.error(describeError(e)) });

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">
        {t("shown", { count: picked.length })}
        {full && <span className="ml-2 font-normal text-muted-foreground">· {t("max", { max: MAX_SITE_TEACHERS })}</span>}
      </p>
      <ul className="divide-y divide-border/70 rounded-xl border border-border/70">
        {rows.map((teacher) => {
          const place = picked.indexOf(teacher.id);
          const on = place !== -1;
          const label = name(teacher);
          return (
            <li key={teacher.id} className={cn("flex items-center gap-3 px-3 py-2.5 sm:px-4", on && "bg-brand-soft/60")}>
              {teacher.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- signed links to private storage
                <img src={teacher.photo} alt="" className="size-10 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserRound className="size-5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {on && <span className="mr-1.5 text-muted-foreground tabular-nums">{place + 1}.</span>}
                  {label}
                </p>
                <p className="truncate text-xs text-muted-foreground">{teacher.designation || t("noTitle")}</p>
              </div>
              {on && (
                <div className="flex shrink-0">
                  <Button variant="ghost" size="icon" className="size-8" aria-label={`${t("moveUp")}: ${label}`} disabled={place === 0} onClick={() => move(place, place - 1)}>
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`${t("moveDown")}: ${label}`}
                    disabled={place === picked.length - 1}
                    onClick={() => move(place, place + 1)}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
              )}
              <Switch checked={on} disabled={!on && full} onCheckedChange={(v) => toggle(teacher.id, v)} aria-label={`${t("show")}: ${label}`} />
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end gap-2">
        {changed && (
          <Button variant="ghost" onClick={() => setPicked(saved)} disabled={save.isPending}>
            {t("undo")}
          </Button>
        )}
        <Button onClick={submit} disabled={!changed || save.isPending}>
          {save.isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
