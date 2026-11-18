import type { ReactNode } from "react";
import { ShellSkeleton } from "@/components/layout/ShellSkeleton";
import type { SessionType } from "@/lib/tenant";

type Props = {
  loading?: boolean;
  // whose dashboard is loading (its menu's colours)
  session?: SessionType;
  title?: string;
  message?: string;
  actions?: ReactNode;
};

/** The dashboard's outline while a session loads, or a centered message when it can't. */
export function FullPageState({ loading, session, title, message, actions }: Props) {
  if (loading) return <ShellSkeleton session={session} />;
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-canvas p-6">
      <div className="max-w-sm space-y-3 text-center">
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        {actions && <div className="flex justify-center gap-2 pt-2">{actions}</div>}
      </div>
    </div>
  );
}
