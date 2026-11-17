"use client";

import { AlertTriangle, Ban, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type ReactNode } from "react";
import { FormError } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import type { DeleteBlocker, DeleteCheck } from "@/lib/school/deletes";

// keys the server sends; those without a translation show as they come
type DeletesKey = Parameters<ReturnType<typeof useTranslations<"deletes">>>[0];
const removeKey = (key: string) => `removes.${key}` as DeletesKey;
// counts of what stays (shown apart from what goes): students left without a class, paid
// fees kept, routine periods and sections left without the teacher
const STAYS = new Set(["studentsUnplaced", "feesKept", "routineCleared", "classTeacherCleared"]);

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  // a warning shown in red above the form (e.g. "a published result guardians can see")
  warning?: ReactNode;
  // what the server says the delete would do; while loading, the button waits
  check?: { data?: DeleteCheck; isPending: boolean; error: unknown } | null;
  // the reason asked for: required (money, an exam with marks), optional, or not asked
  reason?: "required" | "optional" | "none";
  // the text to type before the button works (an admission number, a year, an exam's name)
  confirmText?: string | null;
  confirmLabel?: string;
  // "void" for money reversals (nothing is erased), "delete" otherwise
  tone?: "delete" | "void";
  pending: boolean;
  error?: string | null;
  onConfirm: (input: { reason: string }) => void;
};

/**
 * The one confirm dialog for deleting or reversing something: what stops it, what goes with
 * it, a reason and a word to type when it matters. The server checks all of it again.
 */
export function ConfirmActionDialog({
  open,
  onClose,
  title,
  description,
  warning,
  check,
  reason = "none",
  confirmText,
  confirmLabel,
  tone = "delete",
  pending,
  error,
  onConfirm,
}: Props) {
  const t = useTranslations("deletes");
  const tCommon = useTranslations("common");
  const describeError = useErrorMessage();
  const id = useId();
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const close = () => {
    if (pending) return;
    setText("");
    setTyped("");
    setLocalError(null);
    onClose();
  };

  const loading = !!check && check.isPending;
  const checkFailed = !!check && !check.isPending && !check.data;
  const blocked = !!check?.data && !check.data.canDelete;
  const counts = Object.entries(check?.data?.willRemove ?? {}).filter(([, n]) => n > 0);
  const removes = counts.filter(([key]) => !STAYS.has(key));
  const stays = counts.filter(([key]) => STAYS.has(key));
  const typedOk = !confirmText || typed.trim().toLowerCase() === confirmText.trim().toLowerCase();

  const submit = () => {
    if (reason === "required" && text.trim().length < 3) return setLocalError(t("reasonRequired"));
    if (!typedOk) return setLocalError(t("typeMismatch"));
    setLocalError(null);
    onConfirm({ reason: text.trim() });
  };

  const Icon = tone === "void" ? Ban : Trash2;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{blocked ? t("cannotTitle") : title}</DialogTitle>
          {description && !blocked && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> {t("checking")}
          </p>
        ) : checkFailed ? (
          <FormError message={t("checkFailed", { error: describeError(check?.error) })} />
        ) : blocked ? (
          <div className="space-y-2 text-sm">
            <p>{t("blockersIntro")}</p>
            <ul className="list-disc space-y-1 ps-5">
              {check!.data!.blockers.map((b) => (
                <li key={b.key}>
                  <BlockerLine blocker={b} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {warning && (
              <p className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" /> <span>{warning}</span>
              </p>
            )}
            {removes.length > 0 && (
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{t("removesIntro")}</p>
                <ul className="list-disc space-y-0.5 ps-5">
                  {removes.map(([key, count]) => (
                    <li key={key}>{t.has(removeKey(key)) ? t(removeKey(key), { count }) : `${key}: ${count}`}</li>
                  ))}
                </ul>
              </div>
            )}
            {stays.length > 0 && (
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{t("staysIntro")}</p>
                <ul className="list-disc space-y-0.5 ps-5">
                  {stays.map(([key, count]) => (
                    <li key={key}>{t.has(removeKey(key)) ? t(removeKey(key), { count }) : `${key}: ${count}`}</li>
                  ))}
                </ul>
              </div>
            )}
            <FormError message={localError ?? error} />
            {reason !== "none" && (
              <div className="space-y-1.5">
                <Label htmlFor={`${id}-reason`} required={reason === "required"}>
                  {t("reason")}
                </Label>
                <Input
                  id={`${id}-reason`}
                  value={text}
                  maxLength={300}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("reasonPlaceholder")}
                  autoFocus
                />
              </div>
            )}
            {confirmText && (
              <div className="space-y-1.5">
                <Label htmlFor={`${id}-typed`} required>
                  {t.rich("typeToConfirm", {
                    text: confirmText,
                    b: (chunks) => <span className="font-mono font-semibold">{chunks}</span>,
                  })}
                </Label>
                <Input id={`${id}-typed`} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={pending}>
            {blocked ? tCommon("close") : tCommon("cancel")}
          </Button>
          {!blocked && !checkFailed && (
            <Button variant="destructive" onClick={submit} disabled={pending || loading || !typedOk}>
              <Icon /> {pending ? t("working") : (confirmLabel ?? t(tone === "void" ? "void" : "delete"))}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* A blocker in the reader's language; the server's own words when there is no translation. */
function BlockerLine({ blocker }: { blocker: DeleteBlocker }) {
  const t = useTranslations("deletes.blockers");
  const key = blocker.key as Parameters<typeof t>[0];
  return <>{t.has(key) ? t(key, { count: blocker.count }) : blocker.message}</>;
}
