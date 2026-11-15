"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { httpClient } from "@/lib/api/httpClient";
import type { ApiResponse } from "@/lib/api/types";
import type { AnnouncementKind } from "@/lib/platform/announcements";

// Mirrors server/src/app/modules/announcement (the school side): the platform's announcements,
// read by the school super admin only. Dates arrive as ISO strings.

export type { AnnouncementKind };

export type SchoolAnnouncement = {
  id: string;
  kind: AnnouncementKind;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  read: boolean;
  createdAt: string;
};

export type SchoolAnnouncementList = {
  items: SchoolAnnouncement[];
  unread: number;
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AnnouncementQuery = { page?: number; limit?: number };

export const announcementsApi = {
  list: async (query: AnnouncementQuery) =>
    (await httpClient.get<ApiResponse<SchoolAnnouncementList>>("/announcement", { params: query })).data.data,

  unreadCount: async () => (await httpClient.get<ApiResponse<{ unread: number }>>("/announcement/unread-count")).data.data,

  markRead: async (announcementId: string) =>
    (await httpClient.post<ApiResponse<{ unread: number }>>(`/announcement/${announcementId}/read`)).data.data,

  markAllRead: async () => (await httpClient.post<ApiResponse<{ unread: number }>>("/announcement/read-all")).data.data,
};

const announcementsKey = ["school", "announcements"] as const;
const countKey = [...announcementsKey, "unread-count"] as const;

// announcements are rare: every few minutes is plenty (and on returning to the tab)
const POLL_MS = 5 * 60_000;

/** The bell's number. When it goes up, the lists are fetched again so new ones show. */
export const useAnnouncementUnreadCount = (enabled = true) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: countKey,
    queryFn: announcementsApi.unreadCount,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
    enabled,
  });

  const unread = query.data?.unread;
  const last = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (unread !== undefined && last.current !== undefined && unread > last.current) {
      queryClient.invalidateQueries({ queryKey: [...announcementsKey, "list"] });
    }
    last.current = unread;
  }, [unread, queryClient]);

  return unread ?? 0;
};

export const useAnnouncements = (query: AnnouncementQuery, enabled = true) =>
  useQuery({
    queryKey: [...announcementsKey, "list", query],
    queryFn: () => announcementsApi.list(query),
    placeholderData: keepPreviousData,
    enabled,
  });

const useReadMutation = <TArgs>(mutationFn: (args: TArgs) => Promise<{ unread: number }>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: ({ unread }) => {
      // the badge changes at once; the lists catch up
      queryClient.setQueryData(countKey, { unread });
      queryClient.invalidateQueries({ queryKey: [...announcementsKey, "list"] });
    },
  });
};

export const useMarkAnnouncementRead = () => useReadMutation(announcementsApi.markRead);
export const useMarkAllAnnouncementsRead = () => useReadMutation(() => announcementsApi.markAllRead());
