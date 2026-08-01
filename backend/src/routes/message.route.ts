import { Router } from "express";
import { protect } from "../middelwares/auth.middelware.js"; 
import { MessageController } from "../controllers/message.controller.js";

const router = Router();
const messageController = new MessageController();
router.post("/", protect, messageController.sendMessageController.bind(messageController));
router.get("/inbox", protect, messageController.getInboxController.bind(messageController));
router.get("/:contactId", protect, messageController.getHistoryController.bind(messageController));
export default router;