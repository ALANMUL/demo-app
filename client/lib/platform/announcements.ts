"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/httpClient";
import type { ApiResponse } from "@/lib/api/types";

// Mirrors server/src/app/modules/announcement (the platform side). Dates arrive as ISO strings.

export type AnnouncementKind = "NEW_FEATURE" | "CHANGE" | "MAINTENANCE";
export const ANNOUNCEMENT_KINDS: AnnouncementKind[] = ["NEW_FEATURE", "CHANGE", "MAINTENANCE"];

export type AnnouncementBody = {
  kind: AnnouncementKind;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
};

export type PlatformAnnouncement = AnnouncementBody & {
  id: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  // how many school super admins opened it
  _count: { reads: number };
};

export type PlatformAnnouncementList = {
  items: PlatformAnnouncement[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

// --------------------------------------------------------------------- api

export const platformAnnouncementsApi = {
  list: async (query: { page: number; limit: number }) =>
    (await httpClient.get<ApiResponse<PlatformAnnouncementList>>("/platform/announcement", { params: query })).data.data,

  create: async (body: AnnouncementBody) =>
    (await httpClient.post<ApiResponse<PlatformAnnouncement>>("/platform/announcement", body)).data.data,

  // an update replaces every field
  update: async ({ announcementId, body }: { announcementId: string; body: AnnouncementBody }) =>
    (await httpClient.put<ApiResponse<PlatformAnnouncement>>(`/platform/announcement/${announcementId}`, body)).data.data,

  remove: async (announcementId: string) => {
    await httpClient.delete(`/platform/announcement/${announcementId}`);
  },
};

// ------------------------------------------------------------------- hooks

const announcementsKey = ["platform", "announcements"] as const;

export const usePlatformAnnouncements = (query: { page: number; limit: number }) =>
  useQuery({
    queryKey: [...announcementsKey, query],
    queryFn: () => platformAnnouncementsApi.list(query),
    placeholderData: keepPreviousData,
  });

const useAnnouncementMutation = <TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: announcementsKey }),
  });
};

export const useCreateAnnouncement = () => useAnnouncementMutation(platformAnnouncementsApi.create);
export const useUpdateAnnouncement = () => useAnnouncementMutation(platformAnnouncementsApi.update);
export const useDeleteAnnouncement = () => useAnnouncementMutation(platformAnnouncementsApi.remove);
