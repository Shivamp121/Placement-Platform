import type { Request, Response } from "express";
import { MessageService } from "../services/message.service.js";

const messageService = new MessageService();

export class MessageController {
  async sendMessageController(req: Request, res: Response) {
    try {
      const senderId = (req as any).user.id;
      const { receiverId, content } = req.body;

      if (!receiverId || !content) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const message = await messageService.sendMessage(senderId, receiverId, content);
      res.status(201).json({ success: true, data: message });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getHistoryController(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { contactId } = req.params;
      if (!contactId || typeof contactId !== "string") {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid or missing challengeId parameter" 
        });
      }
      const history = await messageService.getChatHistory(userId, contactId);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async getInboxController(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const inbox = await messageService.getUserInbox(userId);
    
    res.status(200).json({ success: true, data: inbox });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
}