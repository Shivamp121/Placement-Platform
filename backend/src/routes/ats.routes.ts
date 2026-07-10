import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { evaluateApplicationController } from "../controllers/ats.controller.js";

const router = Router();
router.get("/evaluate/:jobId", protect, authorize("STUDENT"), evaluateApplicationController);

export default router;