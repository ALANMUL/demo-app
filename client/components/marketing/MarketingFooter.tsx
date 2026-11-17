import { getTranslations } from "next-intl/server";
import { companyContact, localPhone } from "@/lib/marketing/company";
import { MARKETING_SECTIONS } from "@/lib/marketing/sections";
import { BrandMark } from "./BrandMark";
import { PAGE } from "./Margin";

/** The marketing site's footer, on the hero's sky-blue paper: the name, the sections, the way schools log in. */
export async function MarketingFooter() {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations("marketing.footer"),
    getTranslations("marketing.nav"),
    getTranslations("common"),
  ]);
  const name = tCommon("appName");
  const { phone, email } = companyContact;

  return (
    <footer className="bg-mk-sky text-mk-ink">
      <div className={`${PAGE} grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.3fr]`}>
        <div className="space-y-4">
          <BrandMark name={name} onWhite />
          <p className="max-w-sm text-base leading-relaxed text-mk-slate">{t("about")}</p>
        </div>

        <nav aria-label={t("links")}>
          <h2 className="mb-4 text-base font-bold">{t("links")}</h2>
          <ul className="space-y-2.5 text-base">
            {MARKETING_SECTIONS.map((section) => (
              <li key={section}>
                <a href={`#${section}`} className="text-mk-slate transition-colors hover:text-mk-ink hover:underline">
                  {tNav(section)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-base font-bold">{t("schools")}</h2>
          <p className="text-base leading-relaxed text-mk-slate">{t("login")}</p>
          <p className="mt-3 inline-block rounded-md border border-mk-rule bg-white px-3 py-1.5 text-base" data-ascii-digits>
            {t("loginAddress")}
          </p>
          {(phone || email) && (
            <ul className="mt-5 space-y-1.5 text-base text-mk-slate">
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="tabular-nums hover:text-mk-ink hover:underline">
                    {localPhone(phone)}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="break-all hover:text-mk-ink hover:underline">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-mk-rule">
        <div className={`${PAGE} flex flex-col gap-2 py-6 text-sm text-mk-slate sm:flex-row sm:justify-between`}>
          <p>{t("rights", { year: new Date().getFullYear(), name })}</p>
          <p>{t("made")}</p>
        </div>
      </div>
    </footer>
  );
}
