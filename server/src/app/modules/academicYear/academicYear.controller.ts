import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import type { OptionalReasonQuery } from "../../shared/deleteSchemas";
import { AcademicYearService } from "./academicYear.service";
import { AcademicYearDeleteService } from "./academicYearDelete.service";

const createAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.createAcademicYear(req.auth!.schoolId!, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academic year created successfully",
    data: result,
  });
});

const getAcademicYears = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.getAcademicYears(req.auth!.schoolId!);

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic years retrieved successfully", data: result });
});

const getAcademicYearById = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.getAcademicYearById(req.auth!.schoolId!, req.params.academicYearId as string);

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic year retrieved successfully", data: result });
});

const updateAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.updateAcademicYear(
    req.auth!.schoolId!,
    req.params.academicYearId as string,
    req.body,
  );

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic year updated successfully", data: result });
});

const setCurrentAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicYearService.setCurrentAcademicYear(req.auth!.schoolId!, req.params.academicYearId as string);

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Current academic year changed", data: result });
});

const deleteCheck = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicYearDeleteService.deleteCheck(req.auth!.schoolId!, req.params.academicYearId as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Delete check done", data });
});

const deleteAcademicYear = catchAsync(async (req: Request, res: Response) => {
  const data = await AcademicYearDeleteService.deleteAcademicYear(
    req.auth!,
    req.params.academicYearId as string,
    req.query as OptionalReasonQuery,
  );
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Academic year deleted", data });
});

export const AcademicYearController = {
  deleteCheck,
  deleteAcademicYear,
  createAcademicYear,
  getAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  setCurrentAcademicYear,
};
