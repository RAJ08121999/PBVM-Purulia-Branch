import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.admin?.role !== "SuperAdministrator") {
    res.status(403).json({ success: false, message: "Super Administrator access required" });
    return;
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.admin || !["Administrator", "SuperAdministrator"].includes(req.admin.role)) {
    res.status(403).json({ success: false, message: "Administrator access required" });
    return;
  }
  next();
};
