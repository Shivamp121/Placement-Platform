import type { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
export class jobRepositorty{
    async createJob(data: Prisma.JobUncheckedCreateInput){
        return await prisma.job.create({
            data
        })
    }
    async getAllJob(filter:Prisma.JobWhereInput={}){
        return await prisma.job.findMany({
            where:filter,
            include:{company:{select:{name:true,logo:true}}},
            orderBy:{
                createdAt:'desc'
            }
        })
    }
    async getJobById(jobId:string){
        return await prisma.job.findUnique({
            where:{id:jobId}
        })
    }
    async updateJob(jobId: string, data: Prisma.JobUpdateInput) {
    return await prisma.job.update({
      where: { id: jobId },
      data
    });
  }

  async deleteJob(jobId: string) {
    return await prisma.job.delete({
      where: { id: jobId }
    });
  }
  async getPaginatedJobs(where: Prisma.JobWhereInput, skip: number, take: number) {
    const [jobs, totalCount] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      skip,
      take,
      include: { company: { select: { name: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.job.count({ where })
  ]);

    return { jobs, totalCount };
  }
}