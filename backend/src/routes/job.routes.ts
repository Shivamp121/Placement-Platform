import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { createJobController, getJobsController } from "../controllers/job.controller.js";
const router=Router();

router.get("/",protect,getJobsController);

router.post("/",protect,authorize("RECRUITER","ADMIN"),createJobController);

export default router;