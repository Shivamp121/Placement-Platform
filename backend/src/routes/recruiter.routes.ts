import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
// import { validate } from "../middelwares/validate.middleware.js";
// import { createRecruiterProfileSchema } from "../validators/";
import { createRecruiterProfileController } from "../controllers/recruiter.controller.js";

const router = Router();

// Create profile
router.post(
  "/profile", 
  protect, 
  authorize("RECRUITER"), 
//   validate(createRecruiterProfileSchema), 
  createRecruiterProfileController
);

export default router;