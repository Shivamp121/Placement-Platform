import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
const router=Router();
router.get("/dashboard",protect,authorize("ADMIN"), (req, res) => {res.json({
      message:"Admin Dashboard",
    });
})

export default router;