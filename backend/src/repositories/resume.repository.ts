import prisma from "../config/prisma.js";

export class ResumeRepository {
  async saveResumeRecord(studentId: string, fileName: string, fileUrl: string) {
    const count = await prisma.resume.count({ where: { studentId } });
    
    return await prisma.resume.create({
      data: {
        studentId,
        fileName,
        fileUrl,
        isDefault: count === 0, // First resume uploaded becomes default automatically
      }
    });
  }

  async getResumesByStudent(studentId: string) {
    return await prisma.resume.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
  }
}