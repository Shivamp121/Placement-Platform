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
}