import { Router } from "express";
import {
  getDownloads,
  createDownload,
  trackDownload,
  deleteDownload,
} from "../controllers/download.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getDownloads);
router.post("/:id/track", trackDownload);

router.post("/", authenticate, requireAdmin, upload.single("file"), createDownload);
router.delete("/:id", authenticate, requireAdmin, deleteDownload);

export default router;
