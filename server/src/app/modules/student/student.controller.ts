import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../errorHandler/AppError";
import { checkPermission } from "../../middlewares/authorize";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import type { OptionalReasonQuery } from "../../shared/deleteSchemas";
import { StudentService } from "./student.service";
import { StudentDeleteService } from "./studentDelete.service";
import type { ListStudentsQuery } from "./student.type";

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.createStudent(req.auth!.schoolId!, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student admitted successfully!",
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  // student:update edits the details; the admission date needs its own permission
  if (req.body.admissionDate !== undefined && (await checkPermission(req.auth!, "student:change_admission_date")) !== "OK") {
    throw new AppError("You don't have permission to change the admission date", httpStatus.FORBIDDEN);
  }
  const result = await StudentService.updateStudent(
    req.auth!.schoolId!,
    req.params.studentId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student updated successfully!",
    data: result,
  });
});

const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getStudentById(
    req.auth!.schoolId!,
    req.params.studentId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully!",
    data: result,
  });
});

const getStudents = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getStudents(
    req.auth!.schoolId!,
    req.query as unknown as ListStudentsQuery,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully!",
    data: result,
  });
});

const changePlacement = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.changePlacement(req.auth!.schoolId!, req.params.studentId as string, req.body);

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Placement updated!", data: result });
});

const placeStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.placeStudent(req.auth!.schoolId!, req.params.studentId as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student placed in the class!", data: result });
});

const setPhoto = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.setPhoto(req.auth!.schoolId!, req.params.studentId as string, req.file!.buffer);

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Photo saved!", data: result });
});

const removePhoto = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.removePhoto(req.auth!.schoolId!, req.params.studentId as string);

  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Photo removed!", data: result });
});

const deleteCheck = catchAsync(async (req: Request, res: Response) => {
  const data = await StudentDeleteService.deleteCheck(req.auth!.schoolId!, req.params.studentId as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Delete check done", data });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const data = await StudentDeleteService.deleteStudent(req.auth!, req.params.studentId as string, req.query as OptionalReasonQuery);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student deleted", data });
});

export const StudentController = {
  placeStudent,
  deleteCheck,
  deleteStudent,
  changePlacement,
  setPhoto,
  removePhoto,
  createStudent,
  updateStudent,
  getStudentById,
  getStudents,
};