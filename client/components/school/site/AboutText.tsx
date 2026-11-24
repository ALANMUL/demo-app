"use client";

import { ArrowRight, Quote } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/*
 * The about section's "Learn more": a pill in the accent's deep shade that opens the whole story
 * in a window (every paragraph, then the principal's whole message), so the section itself stays
 * one compact row however much the school wrote.
 */
export function AboutMore({
  label,
  title,
  paragraphs,
  principal,
}: {
  label: string;
  title: string;
  paragraphs: string[];
  principal: { heading: string; message: string; name: string; title: string; photo: string | null } | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          // the mockup's small pill: 12px semibold, white on the school's deep accent
          "inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink",
        )}
      >
        {label}
        <ArrowRight className="size-3" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="border-b pb-4 text-left">
            <DialogTitle className="text-xl leading-snug text-navy">{title}</DialogTitle>
            <DialogDescription className="sr-only">{title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-[17px] leading-relaxed text-foreground/85">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
          {principal && (
            <figure className="mt-2 rounded-[16px] bg-brand-soft p-5">
              <figcaption className="flex items-center gap-2.5">
                <Quote aria-hidden className="size-6 shrink-0 fill-site-gold text-site-gold" strokeWidth={0} />
                <span className="text-lg font-bold text-navy">{principal.heading}</span>
              </figcaption>
              <div className="mt-4 flex flex-col-reverse gap-4 sm:flex-row sm:items-start">
                <blockquote className="min-w-0 flex-1 leading-relaxed whitespace-pre-line text-foreground/85">{principal.message}</blockquote>
                {principal.photo && (
                  // eslint-disable-next-line @next/next/no-img-element -- signed links to private storage
                  <img src={principal.photo} alt={principal.name || principal.title} className="size-20 shrink-0 rounded-full object-cover ring-4 ring-card" />
                )}
              </div>
              <p className="mt-4 font-bold text-navy">
                — {principal.name || principal.title}
                {principal.name && <span className="block text-sm font-normal text-muted-foreground">{principal.title}</span>}
              </p>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
