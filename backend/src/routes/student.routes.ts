import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { createProfile, deleteStudentProfileController, getStudentDashboardDataController, getStudentProfileController, updateStudentProfileController } from "../controllers/student.controller.js";
const router=Router();
// router.get("/dashboard",protect,authorize("STUDENT"), (req, res) => {res.json({
//       message:"Student Dashboard",
//     });
// })
router.post("/profile",protect,authorize("STUDENT"),createProfile)

router.get("/profile",protect,authorize("STUDENT"),getStudentProfileController)

router.put("/profile",protect, authorize("STUDENT"),updateStudentProfileController)

router.delete("/profile",protect,authorize("STUDENT"),deleteStudentProfileController)

router.get("/dashboard",protect,authorize("STUDENT"),getStudentDashboardDataController);


export default router;