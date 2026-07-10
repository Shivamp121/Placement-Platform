import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { updateStatusSchema } from "../validators/application.schema.js";
import { validate } from "../middelwares/validate.middelware.js";
import { 
  applyForJobController, 
  getJobApplicantsController, 
  getMyApplicationsController,
  updateApplicationStatusController
} from "../controllers/application.controller.js";

const router = Router();
router.post("/apply/:jobId", protect, authorize("STUDENT"), applyForJobController);
router.get("/my-applications", protect, authorize("STUDENT"), getMyApplicationsController);

router.get("/job/:jobId", protect, authorize("RECRUITER", "ADMIN"), getJobApplicantsController);

router.patch(
  "/status/:applicationId",
  protect,
  authorize("RECRUITER", "ADMIN"),
  validate(updateStatusSchema),
  updateApplicationStatusController
);
export default router;