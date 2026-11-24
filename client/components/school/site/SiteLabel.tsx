import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * The small label above a homepage heading ("Who we are", "Notices", "Campus"), in the homepage's
 * burnt orange, 11px bold: spaced capitals in English; Bangla has no capitals and reads badly
 * spread out, so it keeps its own letter spacing (and a step larger).
 */
export function SiteLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "block text-[11px] font-bold tracking-[0.2em] text-site-label uppercase [html[lang=bn]_&]:text-xs [html[lang=bn]_&]:tracking-normal",
        className,
      )}
    >
      {children}
    </span>
  );
}
