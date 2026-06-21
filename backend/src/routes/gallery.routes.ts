import { Router } from "express";
import {
  getGallery,
  uploadGalleryImages,
  deleteGalleryImage,
} from "../controllers/gallery.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getGallery);
router.post("/", authenticate, requireAdmin, upload.array("images", 15), uploadGalleryImages);
router.delete("/:id", authenticate, requireAdmin, deleteGalleryImage);

export default router;
