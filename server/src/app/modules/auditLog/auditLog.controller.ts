import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuditLogService } from "./auditLog.service";
import type { AuditLogListQuery } from "./auditLog.validation";

const list = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await AuditLogService.list(req.auth!.schoolId!, req.query as unknown as AuditLogListQuery);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Activity log retrieved successfully!", meta, data: items });
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const data = await AuditLogService.getOne(req.auth!.schoolId!, req.params.logId as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Log entry retrieved successfully!", data });
});

export const AuditLogController = { list, getOne };
