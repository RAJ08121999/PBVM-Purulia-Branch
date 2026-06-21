import { Router } from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEvent);

router.post("/", authenticate, requireAdmin, upload.array("gallery", 10), createEvent);
router.put("/:id", authenticate, requireAdmin, upload.array("gallery", 10), updateEvent);
router.delete("/:id", authenticate, requireAdmin, deleteEvent);

export default router;
