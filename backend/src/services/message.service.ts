import { MessageRepository } from "../repositories/message.repository.js";
import { getIO } from "../config/socket.js";

export class MessageService {
  private messageRepo = new MessageRepository();

  async sendMessage(senderId: string, receiverId: string, content: string) {
    if (senderId === receiverId) {
      throw new Error("You cannot send a message to yourself.");
    }
    const message = await this.messageRepo.saveMessage(senderId, receiverId, content);
    const io = getIO();
    io.to(receiverId).emit("chat:new_message", message);

    return message;
  }

  async getChatHistory(userId: string, contactId: string) {
    return await this.messageRepo.getConversation(userId, contactId);
  }
  async getUserInbox(userId: string) {
  return await this.messageRepo.getInbox(userId);
}
}