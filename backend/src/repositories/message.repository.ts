import prisma from "../config/prisma.js";

export class MessageRepository {
  async saveMessage(senderId: string, receiverId: string, content: string) {
    return await prisma.message.create({
      data: { senderId, receiverId, content },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async getConversation(user1Id: string, user2Id: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      },
      orderBy: { createdAt: 'asc' } 
    });
  }
  async getInbox(userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } }
    }
  });
  const inbox = new Map();

  for (const msg of messages) {
    const isSender = msg.senderId === userId;
    const contactId = isSender ? msg.receiverId : msg.senderId;
    const contactDetails = isSender ? msg.receiver : msg.sender;
    if (!inbox.has(contactId)) {
      inbox.set(contactId, {
        contactId,
        contactDetails,
        latestMessage: msg.content,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
        amISender: isSender
      });
    }
  }
  return Array.from(inbox.values());
}
}