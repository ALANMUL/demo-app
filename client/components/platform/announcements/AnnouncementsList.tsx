"use client";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { AnnouncementKindBadge } from "@/components/announcements/AnnouncementKindBadge";
import { TablePagination } from "@/components/data/TablePagination";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useErrorMessage } from "@/lib/i18n/useErrorMessage";
import { usePlatformAnnouncements, type PlatformAnnouncement } from "@/lib/platform/announcements";
import { cn } from "@/lib/utils";
import { AnnouncementFormDialog } from "./AnnouncementFormDialog";
import { DeleteAnnouncementDialog } from "./DeleteAnnouncementDialog";

const COLUMNS = ["date", "kind", "title", "reads"] as const;
const PAGE_SIZES = [20, 50];

/** The platform's announcements to every school, newest first. */
export function AnnouncementsList() {
  const t = useTranslations("platform.announcements");
  const tCommon = useTranslations("common");
  const describeError = useErrorMessage();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZES[0]);
  const { data, isPending, isError, error, isFetching, refetch } = usePlatformAnnouncements({ page, limit });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<PlatformAnnouncement | null>(null);
  const [deleting, setDeleting] = useState<PlatformAnnouncement | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus /> {t("add")}
        </Button>
      </div>

      <div className={cn("rounded-md border transition-opacity", isFetching && !isPending && "opacity-60")}>
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableHead key={column}>{t(`columns.${column}`)}</TableHead>
              ))}
              <TableHead className="w-12">
                <span className="sr-only">{t("columns.actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: COLUMNS.length + 1 }, (_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <MessageRow>
                <p>{t("loadFailed")}</p>
                <p className="text-xs">{describeError(error)}</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  {tCommon("tryAgain")}
                </Button>
              </MessageRow>
            ) : data.items.length === 0 ? (
              <MessageRow>
                <p>{t("empty")}</p>
              </MessageRow>
            ) : (
              data.items.map((announcement) => (
                <AnnouncementRow
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={() => setEditing(announcement)}
                  onDelete={() => setDeleting(announcement)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.meta.total > data.meta.limit && (
        <TablePagination
          page={data.meta.page}
          limit={data.meta.limit}
          total={data.meta.total}
          totalPages={Math.max(1, data.meta.totalPages)}
          limits={PAGE_SIZES}
          onPageChange={setPage}
          onLimitChange={(n) => {
            setLimit(n);
            setPage(1);
          }}
          disabled={isFetching}
        />
      )}

      <AnnouncementFormDialog
        open={adding || !!editing}
        announcement={editing}
        onClose={() => {
          setAdding(false);
          setEditing(null);
        }}
      />
      <DeleteAnnouncementDialog announcement={deleting} onClose={() => setDeleting(null)} />
    </div>
  );
}

function MessageRow({ children }: { children: React.ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={COLUMNS.length + 1} className="h-32">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">{children}</div>
      </TableCell>
    </TableRow>
  );
}

function AnnouncementRow({
  announcement,
  onEdit,
  onDelete,
}: {
  announcement: PlatformAnnouncement;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("platform.announcements");
  const format = useFormatter();

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap align-top">{format.dateTime(new Date(announcement.createdAt), { dateStyle: "medium" })}</TableCell>
      <TableCell className="align-top">
        <AnnouncementKindBadge kind={announcement.kind} />
      </TableCell>
      <TableCell className="max-w-md align-top whitespace-normal">
        <div className="font-medium">{announcement.titleEn}</div>
        <div lang="bn" className="text-sm text-muted-foreground">
          {announcement.titleBn}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{announcement.bodyEn}</p>
      </TableCell>
      <TableCell className="align-top text-muted-foreground">{t("reads", { count: announcement._count.reads })}</TableCell>
      <TableCell className="align-top">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" aria-label={t("columns.actions")}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil /> {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 /> {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
