import prisma from "../config/prisma.js";

export class ContestRepository {
  async getChallengeById(challengeId: string) {
    return await prisma.codingChallenge.findUnique({
      where: { id: challengeId }
    });
  }

  async saveSubmission(data: {
    studentId: string;
    challengeId: string;
    language: string;
    sourceCode: string;
    statusId: number;
    timeExecuted: number | null;
    memoryUsed: number | null;
  }) {
    return await prisma.submission.create({ data });
  }
}