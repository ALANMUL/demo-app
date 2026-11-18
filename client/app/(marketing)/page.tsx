import { getTranslations } from "next-intl/server";
import { ContactSection } from "@/components/marketing/ContactSection";
import { Features } from "@/components/marketing/Features";
import { FloatingActions } from "@/components/marketing/FloatingActions";
import { Hero } from "@/components/marketing/Hero";
import { Pricing } from "@/components/marketing/Pricing";
import { companyContact, whatsappLink } from "@/lib/marketing/company";
import { getPublicPackages } from "@/lib/marketing/packages.server";

// One page: the menu jumps between its sections (features, pricing, contact).
export default async function HomePage() {
  // the packages as the platform admin set them, for the packages section and the contact form
  const packages = await getPublicPackages();
  const t = await getTranslations("marketing.floating");
  return (
    <>
      <Hero />
      <Features />
      <Pricing packages={packages} />
      <ContactSection packages={packages} />
      {/* WhatsApp and back to top, fixed at the bottom right */}
      <FloatingActions whatsappHref={whatsappLink(companyContact.whatsapp, t("whatsappText"))} />
    </>
  );
}
