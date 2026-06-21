import { Router } from "express";
import {
  submitContact,
  getContactInquiries,
  updateContactStatus,
  exportContactInquiries,
  deleteContactInquiry,
} from "../controllers/contact.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";

const router = Router();

// Public submission route
router.post("/", submitContact);

// Admin restricted routes
router.get("/admin", authenticate, requireAdmin, getContactInquiries);
router.get("/export", authenticate, requireAdmin, exportContactInquiries);
router.put("/:id/status", authenticate, requireAdmin, updateContactStatus);
router.delete("/admin/:id", authenticate, requireAdmin, deleteContactInquiry);

export default router;
