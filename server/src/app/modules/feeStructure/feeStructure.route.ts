import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { optionalReasonQuery } from "../../shared/deleteSchemas";
import { DeleteController } from "../deletes/delete.controller";
import { FeeStructureController } from "./feeStructure.controller";
import { FeeStructureValidation } from "./feeStructure.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

// a new year's class fees from the year before
router.post(
  "/copy",
  authorize("fee_structure:create"),
  validateRequest({ body: FeeStructureValidation.copyFeeStructures }),
  FeeStructureController.copyFromYear,
);

router.post(
  "/",
  authorize("fee_structure:create"),
  validateRequest({ body: FeeStructureValidation.createFeeStructure }),
  FeeStructureController.createFeeStructure,
);

router.get(
  "/",
  authorize("fee_structure:view"),
  validateRequest({ query: FeeStructureValidation.listFeeStructuresQuery }),
  FeeStructureController.getFeeStructures,
);

router.post(
  "/:feeStructureId/sync",
  authorize("fee_structure:update"),
  validateRequest({ params: FeeStructureValidation.feeStructureIdParams }),
  FeeStructureController.syncFeeStructure,
);

// a class's fee, only while none of its fees was paid or discounted; the super admin only
router.get(
  "/:feeStructureId/delete-check",
  authorize("fee_structure:update"),
  superAdminOnly,
  validateRequest({ params: FeeStructureValidation.feeStructureIdParams }),
  DeleteController.feeStructureCheck,
);

router.delete(
  "/:feeStructureId",
  authorize("fee_structure:update"),
  superAdminOnly,
  validateRequest({ params: FeeStructureValidation.feeStructureIdParams, query: optionalReasonQuery }),
  DeleteController.deleteFeeStructure,
);

export const feeStructureRoutes = router;