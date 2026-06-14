import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js";
import { authorize } from "../middelwares/role.middlewares.js";
import { createCompanyController, getCompanyController, getMyCompaniesController, updateCompanyController } from "../controllers/company.controller.js";
const router=Router();
router.get("/dashboard",protect,authorize("RECRUITER"), (req, res) => {res.json({
      message:"Recruiter Dashboard",
    });
})
router.post("/company",protect,authorize("RECRUITER"),createCompanyController);
router.get("/company/:id",protect,authorize("RECRUITER"),getCompanyController);
router.put("/company/:id",protect,authorize("RECRUITER"),updateCompanyController);
router.get("/my",protect,authorize("RECRUITER"),getMyCompaniesController)
export default router;