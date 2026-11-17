import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import type { OptionalReasonQuery } from "../../shared/deleteSchemas";
import sendResponse from "../../shared/sendResponse";
import { ClassDeleteService } from "../class/classDelete.service";
import { FundReversalService } from "../fund/fundReversal.service";
import { FeeSetupDeleteService } from "../feeType/feeSetupDelete.service";

/* The controllers of the newer deletes and money reversals, used by several modules' routes. */

const reply = (res: Response, message: string, data: unknown) => sendResponse(res, { statusCode: httpStatus.OK, success: true, message, data });
const param = (req: Request, name: string) => req.params[name] as string;
const reason = (req: Request) => req.query as OptionalReasonQuery;
const schoolOf = (req: Request) => req.auth!.schoolId!;

export const DeleteController = {
  // classes and sections
  classDeleteCheck: catchAsync(async (req, res) => reply(res, "Delete check done", await ClassDeleteService.classDeleteCheck(schoolOf(req), param(req, "classId")))),
  deleteClass: catchAsync(async (req, res) => reply(res, "Class deleted successfully!", await ClassDeleteService.deleteClass(req.auth!, param(req, "classId"), reason(req)))),
  sectionDeleteCheck: catchAsync(async (req, res) =>
    reply(res, "Delete check done", await ClassDeleteService.sectionDeleteCheck(schoolOf(req), param(req, "sectionId"))),
  ),
  deleteSection: catchAsync(async (req, res) =>
    reply(res, "Section deleted successfully!", await ClassDeleteService.deleteSection(req.auth!, param(req, "sectionId"), reason(req))),
  ),

  // fee setup
  feeStructureCheck: catchAsync(async (req, res) =>
    reply(res, "Delete check done", await FeeSetupDeleteService.feeStructureCheck(schoolOf(req), param(req, "feeStructureId"))),
  ),
  deleteFeeStructure: catchAsync(async (req, res) =>
    reply(res, "Class fee deleted", await FeeSetupDeleteService.deleteFeeStructure(req.auth!, param(req, "feeStructureId"), reason(req))),
  ),
  feeTypeCheck: catchAsync(async (req, res) => reply(res, "Delete check done", await FeeSetupDeleteService.feeTypeCheck(schoolOf(req), param(req, "feeTypeId")))),
  deleteFeeType: catchAsync(async (req, res) =>
    reply(res, "Fee type deleted", await FeeSetupDeleteService.deleteFeeType(req.auth!, param(req, "feeTypeId"), reason(req))),
  ),
  fundCheck: catchAsync(async (req, res) => reply(res, "Delete check done", await FeeSetupDeleteService.fundDeleteCheck(schoolOf(req), param(req, "fundId")))),
  deleteFund: catchAsync(async (req, res) => reply(res, "Fund deleted", await FeeSetupDeleteService.deleteFund(req.auth!, param(req, "fundId"), reason(req)))),
  deleteCustomFee: catchAsync(async (req, res) =>
    reply(res, "Custom fee removed successfully!", await FeeSetupDeleteService.deleteCustomFee(req.auth!, param(req, "studentFeeId"))),
  ),

  // money moved by hand: voided, never deleted
  voidDeposit: catchAsync(async (req, res) =>
    reply(res, "Deposit voided successfully!", await FundReversalService.voidDeposit(req.auth!, param(req, "transactionId"), req.body)),
  ),
  voidTransfer: catchAsync(async (req, res) =>
    reply(res, "Transfer reversed successfully!", await FundReversalService.voidTransfer(req.auth!, param(req, "transferId"), req.body)),
  ),
};
