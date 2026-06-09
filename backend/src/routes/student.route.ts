import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
const router=Router();
router.get("/dashboard",protect,authorize("STUDENT"), (req, res) => {res.json({
      message:"Student Dashboard",
    });
})

export default router;