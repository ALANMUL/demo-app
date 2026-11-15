import type { ReactNode } from "react";
import { ShellSkeleton } from "@/components/layout/ShellSkeleton";

type Props = {
  loading?: boolean;
  title?: string;
  message?: string;
  actions?: ReactNode;
};

/** The dashboard's outline while a session loads, or a centered message when it can't. */
export function FullPageState({ loading, title, message, actions }: Props) {
  if (loading) return <ShellSkeleton />;
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
