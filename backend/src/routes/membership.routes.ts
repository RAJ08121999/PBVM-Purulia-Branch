import { Router } from "express";
import {
  submitMembership,
  getMemberships,
  updateMembershipStatus,
  exportMemberships,
  updateMembership,
  deleteMembership,
  getVolunteerByVolunteerId,
  sendVolunteerIdUpgradeEmail,
} from "../controllers/membership.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Public routes
router.post("/", upload.single("photo"), submitMembership);
router.get("/volunteer/:volunteerId", getVolunteerByVolunteerId);

// Admin restricted routes
router.get("/admin", authenticate, requireAdmin, getMemberships);
router.get("/export", authenticate, requireAdmin, exportMemberships);
router.put("/:id", authenticate, requireAdmin, updateMembership);
router.put("/:id/status", authenticate, requireAdmin, updateMembershipStatus);
router.post("/:id/send-volunteer-id-card", authenticate, requireAdmin, sendVolunteerIdUpgradeEmail);
router.delete("/admin/:id", authenticate, requireAdmin, deleteMembership);

export default router;

