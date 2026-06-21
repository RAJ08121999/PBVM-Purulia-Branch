import { Router } from "express";
import {
  login,
  getMe,
  updateProfile,
  getAdmins,
  createAdmin,
  deleteAdmin,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireSuperAdmin } from "../middleware/rbac.middleware";

const router = Router();

// Public auth routes
router.post("/login", login);

// Private authenticated routes
router.get("/me", authenticate, getMe);
router.put("/update-profile", authenticate, updateProfile);

// Super Admin restricted routes
router.get("/admins", authenticate, requireSuperAdmin, getAdmins);
router.post("/admins", authenticate, requireSuperAdmin, createAdmin);
router.delete("/admins/:id", authenticate, requireSuperAdmin, deleteAdmin);

export default router;
