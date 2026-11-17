import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { optionalReasonQuery } from "../../shared/deleteSchemas";
import { imageUploadMiddleware } from "../../shared/imageUpload";
import { StudentController } from "./student.controller";
import { StudentValidation } from "./student.validation";

const router = express.Router();

router.use(authenticate("SCHOOL"));

router.post(
  "/",
  authorize("student:create"),
  validateRequest({ body: StudentValidation.createStudent }),
  StudentController.createStudent,
);

router.get(
  "/",
  authorize("student:view"),
  validateRequest({ query: StudentValidation.listStudentsQuery }),
  StudentController.getStudents,
);

router.get(
  "/:studentId",
  authorize("student:view"),
  validateRequest({ params: StudentValidation.studentIdParams }),
  StudentController.getStudentById,
);

// deleting a student: the super admin only; refused while the student has money data
router.get(
  "/:studentId/delete-check",
  authorize("student:delete"),
  superAdminOnly,
  validateRequest({ params: StudentValidation.studentIdParams }),
  StudentController.deleteCheck,
);

router.delete(
  "/:studentId",
  authorize("student:delete"),
  superAdminOnly,
  validateRequest({ params: StudentValidation.studentIdParams, query: optionalReasonQuery }),
  StudentController.deleteStudent,
);

router.patch(
  "/:studentId",
  authorize("student:update"),
  validateRequest({
    params: StudentValidation.studentIdParams,
    body: StudentValidation.updateStudent,
  }),
  StudentController.updateStudent,
);

// a student with no class in the year (their class or section was deleted) into one
router.post(
  "/:studentId/enrollment",
  authorize("student:update"),
  validateRequest({ params: StudentValidation.studentIdParams, body: StudentValidation.placeStudent }),
  StudentController.placeStudent,
);

// section, group or roll in the current year (same class)
router.patch(
  "/:studentId/enrollment",
  authorize("student:update"),
  validateRequest({ params: StudentValidation.studentIdParams, body: StudentValidation.changePlacement }),
  StudentController.changePlacement,
);

// the photo: one image in the "file" field (multipart), resized to 400 px
router.put(
  "/:studentId/photo",
  authorize("student:update"),
  validateRequest({ params: StudentValidation.studentIdParams }),
  imageUploadMiddleware,
  StudentController.setPhoto,
);

router.delete(
  "/:studentId/photo",
  authorize("student:update"),
  validateRequest({ params: StudentValidation.studentIdParams }),
  StudentController.removePhoto,
);

export const studentRoutes = router;