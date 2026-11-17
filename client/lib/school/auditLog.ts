"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/httpClient";
import type { ApiResponse } from "@/lib/api/types";

// Mirrors server/src/app/modules/auditLog: every deletion and money reversal in the school,
// who did it and why (the super admin only).

export type AuditLogEntry = {
  id: string;
  actorUserId: string;
  actorName: string;
  // a platform admin working inside the school
  viaPlatform: boolean;
  // "payment.cancel", "fund.deposit.void", "student.delete", "exam.delete"...
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  reason: string | null;
  createdAt: string;
};

export type AuditLogDetail = AuditLogEntry & { snapshot: unknown };

type Meta = { page: number; limit: number; total: number; totalPages: number };

// "payment" matches every payment.* action; days are Bangladesh calendar days (YYYY-MM-DD)
export type AuditLogQuery = { action?: string; from?: string; to?: string; page: number; limit: number };

export const auditLogApi = {
  list: async (query: AuditLogQuery) => {
    const { data } = await httpClient.get<ApiResponse<AuditLogEntry[]> & { meta: Meta }>("/audit-log", { params: query });
    return { items: data.data, meta: data.meta };
  },
  get: async (logId: string) => (await httpClient.get<ApiResponse<AuditLogDetail>>(`/audit-log/${logId}`)).data.data,
};

const auditKey = ["school", "audit-log"] as const;

export const useAuditLog = (query: AuditLogQuery) =>
  useQuery({ queryKey: [...auditKey, "list", query], queryFn: () => auditLogApi.list(query), placeholderData: keepPreviousData });

export const useAuditLogEntry = (logId: string | null) =>
  useQuery({ queryKey: [...auditKey, "detail", logId], queryFn: () => auditLogApi.get(logId!), enabled: !!logId });
