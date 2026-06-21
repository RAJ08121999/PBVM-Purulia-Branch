import { Router } from "express";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";

const router = Router();

router.get("/", getNotifications);
router.post("/", authenticate, requireAdmin, createNotification);
router.put("/:id", authenticate, requireAdmin, updateNotification);
router.delete("/:id", authenticate, requireAdmin, deleteNotification);

export default router;
