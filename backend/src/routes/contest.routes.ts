import { Router } from "express";
import { ContestController } from "../controllers/contest.cntroller.js";
import { protect } from "../middelwares/auth.middelware.js";

const router = Router();
const contestController = new ContestController();
router.post(
  "/challenges/:challengeId/submit", 
  protect, 
  contestController.submitChallenge.bind(contestController)
);

export default router;