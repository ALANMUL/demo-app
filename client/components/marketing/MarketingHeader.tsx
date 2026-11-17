import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { PAGE } from "./Margin";
import { MarketingNav } from "./MarketingNav";

/** The marketing site's bar: white with a ruled line under it, staying at the top. */
export async function MarketingHeader() {
  const t = await getTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-mk-rule bg-white/95 backdrop-blur-md">
      <div className={`${PAGE} flex h-16 items-center justify-between gap-4`}>
        <Link href="/" aria-label={t("appName")} className="min-w-0 rounded-md focus-visible:ring-2 focus-visible:ring-mk-ink focus-visible:outline-none">
          <BrandMark name={t("appName")} onWhite />
        </Link>
        <MarketingNav />
      </div>
    </header>
  );
}
