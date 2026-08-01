import { Worker, Job } from "bullmq";
import { connection } from "../config/bullmq.js";
import prisma from "../config/prisma.js";
import { AtsService } from "../services/ats.service.js";
import { getIO } from "../config/socket.js";
const atsService = new AtsService();

export const atsWorker = new Worker("ats-parsing-queue", async (job: Job) => {
  const { resumeId, fileUrl,userId } = job.data;
  
  console.log(`[Worker] Started real AI processing for resume ID: ${resumeId}`);

  try {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { atsStatus: "PROCESSING" }
    });
    console.log(`[Worker] Downloading PDF and asking Gemini...`);
    const aiAnalysis = await atsService.evaluateGeneralResume(fileUrl);
    await prisma.resume.update({
      where: { id: resumeId },
      data: { 
        atsStatus: "COMPLETED",
        atsScore: aiAnalysis.atsScore,
        aiFeedback: aiAnalysis.feedback
      }
    });
    const io = getIO();
    console.log(`[Worker Debug] Emitting to userId room: "${userId}" (Type: ${typeof userId})`);
console.log(`[Worker Debug] Current active rooms in Socket.IO:`, io.sockets.adapter.rooms);
    io.to(userId).emit("notification:ats_completed", {
      resumeId,
      score: aiAnalysis.atsScore,
      message: "Your AI Resume Analysis is complete!"
    });

    console.log(`[Worker] Successfully scored resume ID: ${resumeId} with score: ${aiAnalysis.atsScore}`);
  } catch (error: any) {
    console.error(`[Worker] Failed to parse resume ID: ${resumeId}`, error);
    await prisma.resume.update({
      where: { id: resumeId },
      data: { 
        atsStatus: "FAILED",
        aiFeedback: error.message || "Failed to process resume."
      }
    });
    const io = getIO();
    io.to(userId).emit("notification:ats_failed", {
      resumeId,
      message: "We encountered an error analyzing your resume."
    });
    
    throw error;
  }
}, { connection });

atsWorker.on("completed", (job) => console.log(`Job ${job.id} completed!`));
atsWorker.on("failed", (job, err) => console.log(`Job ${job?.id} failed: ${err.message}`));