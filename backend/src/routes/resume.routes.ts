import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { validate } from "../middelwares/validate.middelware.js";
import { generateUploadUrlSchema, saveResumeSchema } from "../validators/resume.schema.js";
import { 
  generateUploadUrlController, 
  saveResumeController, 
  getMyResumesController 
} from "../controllers/resume.controller.js";

const router = Router();

router.post("/generate-url", protect, authorize("STUDENT"), validate(generateUploadUrlSchema), generateUploadUrlController);
router.post("/", protect, authorize("STUDENT"), validate(saveResumeSchema), saveResumeController);
router.get("/", protect, authorize("STUDENT"), getMyResumesController);

export default router;