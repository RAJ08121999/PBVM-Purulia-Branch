import { Router } from "express";
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from "../controllers/publication.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getPublications);

router.post(
  "/",
  authenticate,
  requireAdmin,
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "thumbnailImage", maxCount: 1 },
  ]),
  createPublication
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  upload.fields([
    { name: "pdfFile", maxCount: 1 },
    { name: "thumbnailImage", maxCount: 1 },
  ]),
  updatePublication
);

router.delete("/:id", authenticate, requireAdmin, deletePublication);

export default router;
