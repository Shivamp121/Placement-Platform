import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { getJobDashboardMetricsController } from "../controllers/analytics.controller.js";

const router = Router();
router.get("/job/:jobId", protect, authorize("RECRUITER", "ADMIN"), getJobDashboardMetricsController);

export default router;