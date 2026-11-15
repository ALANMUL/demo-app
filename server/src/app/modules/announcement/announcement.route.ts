import express from "express";
import validateRequest from "../../errorHandler/validateRequest";
import authenticate from "../../middlewares/auth";
import { superAdminOnly } from "../../middlewares/authorize";
import { AnnouncementController } from "./announcement.controller";
import { AnnouncementValidation } from "./announcement.validation";

// ---------------------------------------------------------------- school
// the school super admin reads the platform's announcements in the header bell

const router = express.Router();

router.use(authenticate("SCHOOL"), superAdminOnly);

router.get("/", validateRequest({ query: AnnouncementValidation.listQuery }), AnnouncementController.listForSchool);
router.get("/unread-count", AnnouncementController.unreadCount);
router.post("/read-all", AnnouncementController.markAllRead);
router.post(
  "/:announcementId/read",
  validateRequest({ params: AnnouncementValidation.announcementIdParams }),
  AnnouncementController.markRead,
);

export const schoolAnnouncementRoutes = router;

// ---------------------------------------------------------------- platform
// the announcements to every school, written by the platform admin

const platformRouter = express.Router();

platformRouter.use(authenticate("PLATFORM"));

platformRouter.post("/", validateRequest({ body: AnnouncementValidation.announcementBody }), AnnouncementController.create);
platformRouter.get("/", validateRequest({ query: AnnouncementValidation.listQuery }), AnnouncementController.listForPlatform);
platformRouter.put(
  "/:announcementId",
  validateRequest({ params: AnnouncementValidation.announcementIdParams, body: AnnouncementValidation.announcementBody }),
  AnnouncementController.update,
);
platformRouter.delete(
  "/:announcementId",
  validateRequest({ params: AnnouncementValidation.announcementIdParams }),
  AnnouncementController.remove,
);

export const platformAnnouncementRoutes = platformRouter;
