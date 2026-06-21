import { Router } from "express";
import {
  submitMembership,
  getMemberships,
  updateMembershipStatus,
  exportMemberships,
  deleteMembership,
} from "../controllers/membership.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";

const router = Router();

// Public submission route
router.post("/", submitMembership);

// Admin restricted routes
router.get("/admin", authenticate, requireAdmin, getMemberships);
router.get("/export", authenticate, requireAdmin, exportMemberships);
router.put("/:id/status", authenticate, requireAdmin, updateMembershipStatus);
router.delete("/admin/:id", authenticate, requireAdmin, deleteMembership);

export default router;
