import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

/** The platform's mark: a gold cap on a navy tile, and the name beside it (navy on white, white on navy). */
export function BrandMark({ name, onWhite, className }: { name: string; onWhite?: boolean; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md text-mk-gold", onWhite ? "bg-mk-ink" : "bg-white/10")}>
        <GraduationCap className="size-5" strokeWidth={2.25} />
      </span>
      <span className={cn("truncate text-[19px] leading-none font-bold", onWhite ? "text-mk-ink" : "text-white")}>{name}</span>
    </span>
  );
}
