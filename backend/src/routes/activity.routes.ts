import { Router } from "express";
import {
  getActivities,
  getActivityBySlug,
  updateActivity,
} from "../controllers/activity.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getActivities);
router.get("/:slug", getActivityBySlug);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateActivity
);

export default router;
