"use client";

import type { LucideIcon } from "lucide-react";
import { Armchair, Award, FileBadge, FileChartColumn, IdCard, ListChecks, PencilLine, Ruler, SlidersHorizontal, Split } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCan } from "@/lib/auth/hooks";
import { cn } from "@/lib/utils";
import { AdmitCardsTab } from "./admit/AdmitCardsTab";
import { ExamsTab } from "./ExamsTab";
import { FinalResultsTab } from "./final/FinalResultsTab";
import { GradingScales } from "./GradingScales";
import { MarksTab } from "./marks/MarksTab";
import { OptionalSubjects } from "./OptionalSubjects";
import { CardSettingsTab } from "./results/CardSettingsTab";
import { ResultsTab } from "./results/ResultsTab";
import { ResultSettings } from "./ResultSettings";
import { SeatingTab } from "./seating/SeatingTab";

type Part = "exams" | "marks" | "results" | "final" | "seating" | "admit" | "scales" | "settings" | "card" | "optional";

const ICONS: Record<Part, LucideIcon> = {
  exams: ListChecks,
  marks: PencilLine,
  results: FileChartColumn,
  final: Award,
  seating: Armchair,
  admit: IdCard,
  scales: Ruler,
  settings: SlidersHorizontal,
  card: FileBadge,
  optional: Split,
};

// the parts in the order they're used: the exams themselves, what exam day needs, then the setup
const GROUPS = [
  { key: "work", parts: ["exams", "marks", "results", "final"] },
  { key: "examDay", parts: ["seating", "admit"] },
  { key: "setup", parts: ["scales", "settings", "card", "optional"] },
] as const satisfies readonly { key: string; parts: readonly Part[] }[];

/*
 * Exams and results: the header panel, then one sheet with the page's own index down its left
 * (the parts grouped by when they're used) and the chosen part beside it. The part is in the
 * address (/exams?part=marks), so Back, reloads and links return to it. On a phone the index
 * folds into a picker at the top of the sheet.
 */
export function ExamsPage() {
  const t = useTranslations("school.exams");
  const can = useCan();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const canManageGrading = can("grading:manage");

  const allowed: Record<Part, boolean> = {
    exams: can("exam:view"),
    marks: can("exam:view"),
    results: can("exam:view_result"),
    final: can("exam:view_result"),
    card: can("exam:view_result"),
    optional: can("exam:view"),
    seating: can("exam:view"),
    admit: can("exam:view"),
    scales: can("grading:view"),
    settings: can("grading:view"),
  };
  const groups = GROUPS.map((g) => ({ key: g.key, parts: g.parts.filter((p) => allowed[p]) })).filter((g) => g.parts.length > 0);
  const parts = groups.flatMap((g) => g.parts) as Part[];

  const asked = params.get("part") as Part | null;
  const part: Part | undefined = asked && parts.includes(asked) ? asked : parts[0];
  const open = (next: Part) => {
    const query = new URLSearchParams(params);
    if (next === parts[0]) query.delete("part");
    else query.set("part", next);
    const qs = query.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // set by "Enter marks" on an exam: Marks opens on that exam and class
  const [marksStart, setMarksStart] = useState<{ examId: string; classId: string; at: number } | undefined>();
  const label = (p: Part) => t(`tabs.${p}`);

  return (
    <div className="flex flex-1 flex-col gap-2 md:min-h-[calc(100svh-5.5rem)]">
      {/* the trail ends on the open part: "Home / Exams / Marks" */}
      <PageHero title={t("title")} description={t("description")} trail={part ? [{ label: label(part) }] : []} />

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card lg:flex-row">
        {/* the index: a list down the left from 1024px, a picker above the part below that */}
        <nav aria-label={t("partsLabel")} className="border-b border-border/60 bg-muted/40 p-3 lg:w-60 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-2.5 lg:py-3.5">
          <div className="lg:hidden">
            <Select value={part} onValueChange={(v) => open(v as Part)}>
              <SelectTrigger className="w-full bg-card font-semibold text-navy dark:bg-card" aria-label={t("partsLabel")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectGroup key={g.key}>
                    <SelectLabel>{t(`groups.${g.key}`)}</SelectLabel>
                    {g.parts.map((p) => (
                      <SelectItem key={p} value={p}>
                        {label(p)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden space-y-4 lg:block">
            {groups.map((g) => (
              <div key={g.key}>
                <p className="mb-1.5 px-2.5 text-[12.5px] font-semibold text-muted-foreground">{t(`groups.${g.key}`)}</p>
                <ul className="space-y-0.5">
                  {g.parts.map((p) => {
                    const Icon = ICONS[p];
                    const on = p === part;
                    return (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => open(p)}
                          aria-current={on ? "page" : undefined}
                          className={cn(
                            "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                            on
                              ? "bg-card font-bold text-navy shadow-[inset_3px_0_0_var(--sidebar-primary),0_1px_2px_rgb(0_0_0/0.06)]"
                              : "text-foreground/85 hover:bg-card",
                          )}
                        >
                          <Icon className={cn("size-4 shrink-0", on ? "text-navy" : "text-muted-foreground")} />
                          <span className="truncate">{label(p)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* the chosen part */}
        <section aria-label={part ? label(part) : undefined} className="min-w-0 flex-1 p-3 sm:p-4">
          {part === "exams" && (
            <ExamsTab
              canManage={can("exam:create")}
              onEnterMarks={(examId, classId) => {
                setMarksStart({ examId, classId, at: Date.now() });
                open("marks");
              }}
            />
          )}
          {part === "marks" && <MarksTab key={marksStart?.at} start={marksStart} />}
          {part === "results" && <ResultsTab />}
          {part === "final" && <FinalResultsTab />}
          {part === "card" && <CardSettingsTab canManage={canManageGrading} />}
          {part === "optional" && <OptionalSubjects canManage={can("exam:create")} />}
          {part === "seating" && <SeatingTab />}
          {part === "admit" && <AdmitCardsTab />}
          {part === "scales" && <GradingScales canManage={canManageGrading} />}
          {part === "settings" && <ResultSettings canManage={canManageGrading} onOpenScales={() => open("scales")} />}
        </section>
      </div>
    </div>
  );
}
