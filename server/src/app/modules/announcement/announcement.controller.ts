import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AnnouncementService } from "./announcement.service";
import type { AnnouncementListQuery } from "./announcement.validation";

const reply = <T>(res: Response, statusCode: number, message: string, data: T) => sendResponse(res, { statusCode, success: true, message, data });

const idOf = (req: Request) => req.params.announcementId as string;
const listQueryOf = (req: Request) => req.query as unknown as AnnouncementListQuery;

// ----------------------------------------------------------------- platform admin

const create = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.CREATED, "Announcement published", await AnnouncementService.create(req.auth!.userId, req.body));
});

const listForPlatform = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.OK, "Announcements retrieved successfully!", await AnnouncementService.listForPlatform(listQueryOf(req)));
});

const update = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.OK, "Announcement updated", await AnnouncementService.update(idOf(req), req.body));
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await AnnouncementService.remove(idOf(req));
  reply(res, httpStatus.OK, "Announcement deleted", null);
});

// ------------------------------------------------------------- school super admin

const listForSchool = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.OK, "Announcements retrieved successfully!", await AnnouncementService.listForSchool(req.auth!, listQueryOf(req)));
});

const unreadCount = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.OK, "Unread count retrieved", await AnnouncementService.unreadCount(req.auth!));
});

const markRead = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.OK, "Announcement marked as read", await AnnouncementService.markRead(req.auth!, idOf(req)));
});

const markAllRead = catchAsync(async (req: Request, res: Response) => {
  reply(res, httpStatus.OK, "All announcements marked as read", await AnnouncementService.markAllRead(req.auth!));
});

export const AnnouncementController = { create, listForPlatform, update, remove, listForSchool, unreadCount, markRead, markAllRead };
