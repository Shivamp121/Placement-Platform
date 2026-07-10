import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { createJobController, deleteJobController, getJobByIdController, getJobsController, updateJobByIdController } from "../controllers/job.controller.js";
const router=Router();

router.get("/",protect,getJobsController);

router.post("/",protect,authorize("RECRUITER","ADMIN"),createJobController);
router.get("/:id",protect,getJobByIdController);
router.put("/:id",protect,authorize("ADMIN","RECRUITER"),updateJobByIdController);
router.delete("/:id",protect,authorize("ADMIN","RECRUITER"),deleteJobController);
export default router;