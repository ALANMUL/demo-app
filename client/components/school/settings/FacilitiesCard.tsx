"use client";

import { Building2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { useAbout, useSaveFacilities } from "@/lib/school/settings";
import { FACILITY_ICONS, SITE_FACILITIES, isSiteFacility, type SiteFacility } from "@/lib/siteFacilities";
import { cn } from "@/lib/utils";

/*
 * The homepage's "Our facilities": the school ticks the ones it has from a fixed list, each with
 * its own icon and name (lib/siteFacilities.ts). They show in the list's order; none hides the section.
 */
export function FacilitiesCard() {
  const t = useTranslations("school.settings.facilities");
  const describeError = useErrorMessage();
  const about = useAbout();

  return (
    <section className="rounded-2xl border border-border/70 bg-card">
      <header className="flex items-center gap-3 border-b px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Building2 className="size-4" />
        </span>
        <div>
          <h2 className="font-semibold">{t("title")}</h2>
          <p className="text-xs text-muted-foreground">{t("hint")}</p>
        </div>
      </header>
      <div className="p-5">
        {about.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : about.isError ? (
          <p className="text-sm text-muted-foreground">{describeError(about.error)}</p>
        ) : (
          // keyed by the saved pick, so a save (or another tab's) starts the form afresh
          <FacilitiesForm key={about.data.facilities.join(",")} saved={about.data.facilities.filter(isSiteFacility)} />
        )}
      </div>
    </section>
  );
}

function FacilitiesForm({ saved }: { saved: SiteFacility[] }) {
  const t = useTranslations("school.settings.facilities");
  const tItem = useTranslations("schoolHome.facilities.items");
  const describeError = useErrorMessage();
  const save = useSaveFacilities();
  const [picked, setPicked] = useState<SiteFacility[]>(saved);
  // kept in the list's order, so the homepage shows them the same way whatever order they were ticked in
  const ordered = SITE_FACILITIES.filter((key) => picked.includes(key));
  const changed = ordered.join(",") !== SITE_FACILITIES.filter((key) => saved.includes(key)).join(",");

  const toggle = (key: SiteFacility) => setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  return (
    <div className="space-y-5">
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {SITE_FACILITIES.map((key) => {
          const Icon = FACILITY_ICONS[key];
          const on = picked.includes(key);
          return (
            <li key={key}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  on ? "border-brand/40 bg-brand-soft font-medium text-navy" : "border-border/70 hover:border-foreground/25",
                )}
              >
                <Icon className={cn("size-4.5 shrink-0", on ? "text-brand" : "text-muted-foreground")} />
                <span className="min-w-0 flex-1">{tItem(key)}</span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-4.5 shrink-0 items-center justify-center rounded-sm border",
                    on ? "border-brand bg-brand text-brand-foreground" : "border-border",
                  )}
                >
                  {on && <Check className="size-3" strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{t("count", { count: ordered.length })}</p>
        <Button
          onClick={() => save.mutate(ordered, { onSuccess: () => toast.success(t("saved")), onError: (e) => toast.error(describeError(e)) })}
          disabled={!changed || save.isPending}
        >
          {save.isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
