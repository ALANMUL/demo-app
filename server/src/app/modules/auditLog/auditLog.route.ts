import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import { superAdminOnly } from "../../middlewares/authorize";
import { AuditLogController } from "./auditLog.controller";
import { AuditLogValidation } from "./auditLog.validation";

// what was deleted or reversed in the school, by whom and why: the super admin only
const router = express.Router();

router.use(authenticate("SCHOOL"), superAdminOnly);

router.get("/", validateRequest({ query: AuditLogValidation.listQuery }), AuditLogController.list);
router.get("/:logId", validateRequest({ params: AuditLogValidation.logIdParams }), AuditLogController.getOne);

export const auditLogRoutes = router;
