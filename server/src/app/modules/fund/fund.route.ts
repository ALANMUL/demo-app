import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { optionalReasonQuery, reasonBody } from "../../shared/deleteSchemas";
import { DeleteController } from "../deletes/delete.controller";
import { FundController } from "./fund.controller";
import { FundValidation } from "./fund.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

router.post(
  "/",
  authorize("fund:create"),
  validateRequest({ body: FundValidation.createFund }),
  FundController.createFund,
);

router.get(
  "/",
  authorize("fund:view"),
  validateRequest({ query: FundValidation.listFundsQuery }),
  FundController.getFunds,
);

router.get(
  "/ledger",
  authorize("fund:ledger"),
  validateRequest({ query: FundValidation.ledgerQuery }),
  FundController.getLedger,
);

router.post(
  "/transfer",
  authorize("fund:transfer"),
  validateRequest({ body: FundValidation.transfer }),
  FundController.transfer,
);

// money moved by hand is voided, never deleted: the school super admin only
router.post(
  "/transactions/:transactionId/void",
  authorize("fund:deposit"),
  superAdminOnly,
  validateRequest({ params: FundValidation.transactionIdParams, body: reasonBody }),
  DeleteController.voidDeposit,
);

router.post(
  "/transfers/:transferId/void",
  authorize("fund:transfer"),
  superAdminOnly,
  validateRequest({ params: FundValidation.transferIdParams, body: reasonBody }),
  DeleteController.voidTransfer,
);

// only a fund money never went through: the super admin only
router.get(
  "/:fundId/delete-check",
  authorize("fund:update"),
  superAdminOnly,
  validateRequest({ params: FundValidation.fundIdParams }),
  DeleteController.fundCheck,
);

router.delete(
  "/:fundId",
  authorize("fund:update"),
  superAdminOnly,
  validateRequest({ params: FundValidation.fundIdParams, query: optionalReasonQuery }),
  DeleteController.deleteFund,
);

router.get(
  "/:fundId",
  authorize("fund:view"),
  validateRequest({ params: FundValidation.fundIdParams }),
  FundController.getFundById,
);

router.patch(
  "/:fundId",
  authorize("fund:update"),
  validateRequest({ params: FundValidation.fundIdParams, body: FundValidation.updateFund }),
  FundController.updateFund,
);

router.post(
  "/:fundId/deposit",
  authorize("fund:deposit"),
  validateRequest({ params: FundValidation.fundIdParams, body: FundValidation.deposit }),
  FundController.deposit,
);

export const fundRoutes = router;