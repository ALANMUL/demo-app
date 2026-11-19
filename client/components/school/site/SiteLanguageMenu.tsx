"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocaleChoice } from "@/components/i18n/LanguageSwitcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** The homepage's thin top bar's language picker: a globe, the language's name and a small arrow, in the school's colour. */
export function SiteLanguageMenu() {
  const t = useTranslations("common");
  const { current, choose, pending } = useLocaleChoice();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm font-medium text-brand-ink transition-opacity hover:opacity-80",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink",
          pending && "opacity-60",
        )}
        aria-label={t("language")}
      >
        <Globe className="size-4" />
        <span lang={current}>{localeLabels[current]}</span>
        <ChevronDown className="size-3.5 opacity-70" />
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
