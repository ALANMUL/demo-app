import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { optionalReasonQuery } from "../../shared/deleteSchemas";
import { DeleteController } from "../deletes/delete.controller";
import { ClassController } from "./class.controller";
import { ClassValidation } from "./class.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

router.post(
  "/create",
  authorize("class:create"),
  validateRequest({ body: ClassValidation.createClass }),
  ClassController.createClass,
);

router.get(
  "/",
  authorize("class:view"),
  validateRequest({ query: ClassValidation.classQuery }),
  ClassController.getClasses,
);

router.get(
  "/:classId",
  authorize("class:view"),
  validateRequest({ params: ClassValidation.classIdParams }),
  ClassController.getClassById,
);

router.patch(
  "/:classId",
  authorize("class:update"),
  validateRequest({ params: ClassValidation.classIdParams, body: ClassValidation.updateClass }),
  ClassController.updateClass,
);

// a class with everything set up for it and done in it; its students stay, unplaced
router.get(
  "/:classId/delete-check",
  authorize("class:view"),
  superAdminOnly,
  validateRequest({ params: ClassValidation.classIdParams }),
  DeleteController.classDeleteCheck,
);

router.delete(
  "/:classId",
  authorize("class:view"),
  superAdminOnly,
  validateRequest({ params: ClassValidation.classIdParams, query: optionalReasonQuery }),
  DeleteController.deleteClass,
);

export const classRoutes = router;
