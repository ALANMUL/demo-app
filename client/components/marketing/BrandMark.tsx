import Image from "next/image";
import logo from "@/assets/sncmt-logo.png";
import { cn } from "@/lib/utils";

/*
 * The platform's mark: the SNCMT logo (a round badge, white inside its navy ring, so it reads on
 * any background) and the name beside it (navy on white, white on navy). The logo is imported,
 * not served from public/, so the build bundles it.
 */
export function BrandMark({ name, onWhite, className }: { name: string; onWhite?: boolean; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <Image src={logo} alt="" width={40} height={40} priority className="size-10 shrink-0 rounded-full" />
      <span className={cn("truncate text-[19px] leading-none font-bold", onWhite ? "text-mk-ink" : "text-white")}>{name}</span>
    </span>
  );
}
