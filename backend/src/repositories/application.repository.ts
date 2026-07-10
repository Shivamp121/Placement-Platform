import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
export class ApplicationRepository{
    async applyToJob(studentProfileId:string,jobId:string){
        return await prisma.application.create({
            data:{
                studentId:studentProfileId,
                jobId:jobId
            }
        });
    }
    async getApplicationsByJobId(jobId: string, statusFilter?: any) {
    return await prisma.application.findMany({
      where: {
        jobId: jobId,
        ...(statusFilter && { status: statusFilter })
      },
      include: {
        student: {
          include: { user: { select: { email: true} } }
        }
      },
      orderBy: { atsScore: 'desc' } 
    });
  }

    async getApplicationByStudentId(studentProfileId:string){
        return await prisma.application.findMany({
            where:{studentId:studentProfileId},
            include:{
                job:{include:{company:{select:{name:true,logoUrl:true}}}},
            },
            orderBy:{appliedAt:"desc"}
        })
    }
}