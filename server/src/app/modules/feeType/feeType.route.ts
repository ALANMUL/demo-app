import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { optionalReasonQuery } from "../../shared/deleteSchemas";
import { DeleteController } from "../deletes/delete.controller";
import { FeeTypeController } from "./feeType.controller";
import { FeeTypeValidation } from "./feeType.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

router.post(
  "/",
  authorize("fee_type:create"),
  validateRequest({ body: FeeTypeValidation.createFeeType }),
  FeeTypeController.createFeeType,
);

router.get(
  "/",
  authorize("fee_type:view"),
  validateRequest({ query: FeeTypeValidation.listFeeTypesQuery }),
  FeeTypeController.getFeeTypes,
);

router.patch(
  "/:feeTypeId",
  authorize("fee_type:update"),
  validateRequest({
    params: FeeTypeValidation.feeTypeIdParams,
    body: FeeTypeValidation.updateFeeType,
  }),
  FeeTypeController.updateFeeType,
);

// only while none of its fees was paid or discounted; the super admin only
router.get(
  "/:feeTypeId/delete-check",
  authorize("fee_type:update"),
  superAdminOnly,
  validateRequest({ params: FeeTypeValidation.feeTypeIdParams }),
  DeleteController.feeTypeCheck,
);

router.delete(
  "/:feeTypeId",
  authorize("fee_type:update"),
  superAdminOnly,
  validateRequest({ params: FeeTypeValidation.feeTypeIdParams, query: optionalReasonQuery }),
  DeleteController.deleteFeeType,
);

export const feeTypeRoutes = router;