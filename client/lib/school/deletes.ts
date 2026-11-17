"use client";

import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/httpClient";
import type { ApiResponse } from "@/lib/api/types";

// Mirrors server/src/app/shared/deleteCheck.ts: what stops a delete (history that must stay)
// and what goes with the record. Each module serves it at GET .../delete-check.

export type DeleteBlocker = { key: string; count: number; message: string };
export type DeleteCheck = { canDelete: boolean; blockers: DeleteBlocker[]; willRemove: Record<string, number> };

/* An exam's check also says who may delete it: anyone with exam:create, or the super admin only. */
export type ExamDeleteCheck = DeleteCheck & { level: "SIMPLE" | "SUPER_ADMIN" };

/** The check for one record, fetched afresh each time a confirm dialog opens (null: closed). */
export const useDeleteCheck = <T extends DeleteCheck = DeleteCheck>(path: string | null) =>
  useQuery({
    queryKey: ["school", "delete-check", path],
    queryFn: async () => (await httpClient.get<ApiResponse<T>>(path!)).data.data,
    enabled: !!path,
    staleTime: 0,
    gcTime: 0,
  });
