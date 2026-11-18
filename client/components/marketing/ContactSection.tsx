import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { companyContact, displayPhone, localPhone, whatsappLink } from "@/lib/marketing/company";
import type { PublicPackage } from "@/lib/marketing/packages";
import { ContactForm } from "./ContactForm";
import { MarginHeading, MarginRow, Note } from "./Margin";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

/**
 * The last section, on navy: WhatsApp first (the quickest way to reach us), the three steps and our
 * contacts at the left, the form on a white card at the right.
 */
export async function ContactSection({ packages }: { packages: PublicPackage[] }) {
  const [t, tFloating] = await Promise.all([getTranslations("marketing.contact"), getTranslations("marketing.floating")]);
  const { phone, email, address, whatsapp } = companyContact;
  const chat = whatsappLink(whatsapp, tFloating("whatsappText"));

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 bg-mk-ink [--mk-line:rgb(255_255_255/0.2)]">
      <MarginRow className="h-20 sm:h-28" />
      <MarginRow note={<Note className="text-white/65 max-lg:mb-4 lg:pt-3">{t("eyebrow")}</Note>}>
        <MarginHeading light id="contact-title" title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)] xl:gap-16">
          <div>
            {/* WhatsApp, set apart: a green rule, the number large, the button in WhatsApp's green */}
            <div className="mb-10 rounded-lg border border-white/15 border-l-4 border-l-[#25D366] bg-white/[0.06] p-5">
              <p className="flex items-center gap-2.5 text-lg font-bold text-white">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppGlyph className="size-[18px]" />
                </span>
                {t("whatsapp.title")}
              </p>
              <p className="mt-2 text-base leading-relaxed text-white/70">{t("whatsapp.body")}</p>
              <a
                href={chat}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-[1.75rem] leading-none font-bold text-white tabular-nums hover:underline"
              >
                {displayPhone(whatsapp)}
              </a>
              <a
                href={chat}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 text-base font-semibold whitespace-nowrap text-mk-ink transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-mk-ink focus-visible:outline-none"
              >
                <WhatsAppGlyph className="size-5" />
                {t("whatsapp.button")}
              </a>
            </div>

            <h3 className="text-xl font-bold text-white">{t("stepsTitle")}</h3>
            {/* a real order: send, see it, go live */}
            <ol className="mt-6 space-y-6">
              {(["step1", "step2", "step3"] as const).map((key, i) => (
                <li key={key} className="flex gap-4">
                  <span className="w-6 shrink-0 text-[1.75rem] leading-none text-mk-gold tabular-nums">{i + 1}</span>
                  <span>
                    <span className="block text-lg font-semibold text-white">{t(`${key}.title`)}</span>
                    <span className="mt-1 block text-base leading-relaxed text-white/70">{t(`${key}.body`)}</span>
                  </span>
                </li>
              ))}
            </ol>

            {(phone || email || address) && (
              <ul className="mt-10 space-y-3 border-t border-white/15 pt-8 text-base text-white">
                {phone && (
                  <li>
                    <a href={`tel:${phone}`} className="flex items-center gap-3 hover:underline">
                      <Phone className="size-4 shrink-0 text-mk-gold" />
                      <span className="tabular-nums">{localPhone(phone)}</span>
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-3 break-all hover:underline">
                      <Mail className="size-4 shrink-0 text-mk-gold" />
                      {email}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-1 size-4 shrink-0 text-mk-gold" />
                    <span className="whitespace-pre-line">{address}</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] sm:p-8">
            <ContactForm packages={packages} />
          </div>
        </div>
      </MarginRow>
      <MarginRow className="h-24 sm:h-32" />
    </section>
  );
}
