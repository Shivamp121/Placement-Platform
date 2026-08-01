import prisma from "../config/prisma.js";
import { ApplicationRepository } from "../repositories/application.repository.js";
import { AtsService } from "./ats.service.js";
const appRepo=new ApplicationRepository();
const atsService=new AtsService();
export class ApplicationService{
    async applyForJob(userId:string,jobId:string){
        const studentProfile = await prisma.studentProfile.findUnique({where:{userId}});
        if(!studentProfile){
            throw new Error("First complete your profile")
        }
        const job=await prisma.job.findUnique({where:{id:jobId}});
        if (!job) throw new Error("Job not found.")
        if (job.status !== "OPEN") throw new Error("This job is no longer accepting applications.")
        try{
      
        const application = await appRepo.applyToJob(studentProfile.id, jobId);
        const aiEvaluation = await atsService.evaluateResumeForJob(userId, jobId);
        const updatedApplication = await prisma.application.update({
        where: { id: application.id },
        data: {
          atsScore: aiEvaluation.atsScore
        }
      });
        return {
        application: updatedApplication,
        aiInsights: aiEvaluation
      };
        }catch(error:any){
            // p2002 is a code remember for uniqueness violation
            if (error.code === 'P2002') {
        throw new Error("You have already applied for this job.");
      }
        }

    }
    async getApplicantsForJob(userId: string, jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job not found.");
    if (job.recruiterId !== userId) {
      throw new Error("Forbidden: You can only view applications for jobs you posted.");
    }
    return await appRepo.getApplicationsByJobId(jobId);
  }

  async getMyApplications(userId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!studentProfile) throw new Error("Student profile not found.");

    return await appRepo.getApplicationByStudentId(studentProfile.id);
  }
  
}