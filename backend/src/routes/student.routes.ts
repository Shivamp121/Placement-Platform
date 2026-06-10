import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { createProfile, getStudentProfileController } from "../controllers/student.controller.js";
const router=Router();
router.get("/dashboard",protect,authorize("STUDENT"), (req, res) => {res.json({
      message:"Student Dashboard",
    });
})
router.post("/profile",protect,authorize("STUDENT"),createProfile)

router.get("/profile",protect,authorize("STUDENT"),getStudentProfileController)

export default router;