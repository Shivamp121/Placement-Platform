import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
const router=Router();
router.get("/dashboard",protect,authorize("RECRUITER"), (req, res) => {res.json({
      message:"Recruiter Dashboard",
    });
})

export default router;