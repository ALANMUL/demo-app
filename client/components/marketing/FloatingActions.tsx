"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

// how far down the page before "back to top" shows
const SHOW_TOP_AFTER = 600;

/*
 * The homepage's two buttons fixed at the bottom right: a chat with us on WhatsApp (the message
 * already typed, in the visitor's language) and, once the visitor has scrolled down, a way back to
 * the top. They stay clear of the phone's home bar.
 */
export function FloatingActions({ whatsappHref }: { whatsappHref: string }) {
  const t = useTranslations("marketing.floating");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > SHOW_TOP_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  };

  return (
    <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <button
        type="button"
        onClick={toTop}
        aria-label={t("top")}
        title={t("top")}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={cn(
          "flex size-11 items-center justify-center rounded-full border border-white/20 bg-mk-ink text-white shadow-[0_10px_24px_-10px_rgb(10_36_95/0.6)] transition-[opacity,transform,background-color] duration-200 hover:bg-mk-ink-2 focus-visible:ring-2 focus-visible:ring-mk-ink focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ArrowUp className="size-5" />
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsapp")}
        title={t("whatsapp")}
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_-10px_rgb(18_140_74/0.7)] transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#128C4A] focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <WhatsAppGlyph className="size-7" />
      </a>
    </div>
  );
}
