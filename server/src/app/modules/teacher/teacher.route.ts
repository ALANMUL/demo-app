import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import authorize, { superAdminOnly } from "../../middlewares/authorize";
import { TeacherController } from "./teacher.controller";
import { imageUploadMiddleware } from "../../shared/imageUpload";
import { optionalReasonQuery } from "../../shared/deleteSchemas";
import { TeacherValidation } from "./teacher.validation";

const router = express.Router();

// -------------------------------------------------------- the teacher's own
// a logged-in teacher's own data: no permission needed, only a real membership
// (a platform admin working through X-School-Id is not a teacher)

const teacherSelf = authenticate("SCHOOL", { memberOnly: true });

router.get("/me", teacherSelf, TeacherController.getMyProfile);

router.get(
  "/me/assignments",
  teacherSelf,
  validateRequest({ query: TeacherValidation.yearQuery }),
  TeacherController.getMyAssignments,
);

router.get(
  "/me/schedule",
  teacherSelf,
  validateRequest({ query: TeacherValidation.scheduleQuery }),
  TeacherController.getMySchedule,
);

// --------------------------------------------------------------- management

router.use(authenticate("SCHOOL"));

router.post(
  "/",
  authorize("teacher:create"),
  validateRequest({ body: TeacherValidation.createTeacher }),
  TeacherController.createTeacher,
);

router.get(
  "/",
  authorize("teacher:view"),
  validateRequest({ query: TeacherValidation.listTeachersQuery }),
  TeacherController.getTeachers,
);

router.get(
  "/:teacherId",
  authorize("teacher:view"),
  validateRequest({ params: TeacherValidation.teacherIdParams, query: TeacherValidation.yearQuery }),
  TeacherController.getTeacherById,
);

router.patch(
  "/:teacherId",
  authorize("teacher:update"),
  validateRequest({ params: TeacherValidation.teacherIdParams, body: TeacherValidation.updateTeacher }),
  TeacherController.updateTeacher,
);

// deleting a teacher (and their attendance, assignments, duties): the super admin only
router.get(
  "/:teacherId/delete-check",
  authorize("teacher:view"),
  superAdminOnly,
  validateRequest({ params: TeacherValidation.teacherIdParams }),
  TeacherController.deleteCheck,
);

router.delete(
  "/:teacherId",
  authorize("teacher:view"),
  superAdminOnly,
  validateRequest({ params: TeacherValidation.teacherIdParams, query: optionalReasonQuery }),
  TeacherController.deleteTeacher,
);

router.post(
  "/:teacherId/deactivate",
  authorize("teacher:deactivate"),
  validateRequest({ params: TeacherValidation.teacherIdParams, body: TeacherValidation.deactivateTeacher }),
  TeacherController.deactivateTeacher,
);

// the photo: one image in the "file" field (multipart), resized to 400 px
router.put(
  "/:teacherId/photo",
  authorize("teacher:update"),
  validateRequest({ params: TeacherValidation.teacherIdParams }),
  imageUploadMiddleware,
  TeacherController.setPhoto,
);

router.delete(
  "/:teacherId/photo",
  authorize("teacher:update"),
  validateRequest({ params: TeacherValidation.teacherIdParams }),
  TeacherController.removePhoto,
);

export const teacherRoutes = router;
