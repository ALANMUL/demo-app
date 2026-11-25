"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocaleChoice } from "@/components/i18n/LanguageSwitcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** The homepage's utility bar's language picker: a globe, the language's name and a small arrow (on a phone the globe alone), in the school's deep accent. */
export function SiteLanguageMenu() {
  const t = useTranslations("common");
  const { current, choose, pending } = useLocaleChoice();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-brand-ink transition-opacity hover:opacity-80",
          // on a phone only the globe shows: a larger target around it
          "-m-2 p-2 sm:m-0 sm:p-0",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink",
          pending && "opacity-60",
        )}
        aria-label={t("language")}
      >
        <Globe aria-hidden className="size-3.5 text-brand-ink" />
        {/* the language's name and the arrow from 640px; on a phone only the globe */}
        <span lang={current} className="hidden sm:inline">
          {localeLabels[current]}
        </span>
        <ChevronDown aria-hidden className="hidden size-2.5 sm:block" />
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
