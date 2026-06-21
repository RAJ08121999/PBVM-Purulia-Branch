import { Router } from "express";
import {
  getPolicyArticles,
  getPolicyArticle,
  createPolicyArticle,
  updatePolicyArticle,
  deletePolicyArticle,
} from "../controllers/policy.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/rbac.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getPolicyArticles);
router.get("/:id", getPolicyArticle);

router.post("/", authenticate, requireAdmin, upload.single("coverImage"), createPolicyArticle);
router.put("/:id", authenticate, requireAdmin, upload.single("coverImage"), updatePolicyArticle);
router.delete("/:id", authenticate, requireAdmin, deletePolicyArticle);

export default router;
