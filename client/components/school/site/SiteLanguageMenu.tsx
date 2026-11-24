"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocaleChoice } from "@/components/i18n/LanguageSwitcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** The homepage's utility bar's language picker: a globe in the school's deep accent, the language's name in slate and a small arrow. */
export function SiteLanguageMenu() {
  const t = useTranslations("common");
  const { current, choose, pending } = useLocaleChoice();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-slate-700 transition-colors hover:text-brand-ink",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink",
          pending && "opacity-60",
        )}
        aria-label={t("language")}
      >
        <Globe className="size-3.5 text-brand-ink" />
        <span lang={current}>{localeLabels[current]}</span>
        <ChevronDown className="size-2.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} lang={locale} onSelect={() => choose(locale)}>
            <span className="flex-1">{localeLabels[locale]}</span>
            {locale === current && <Check className="size-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
