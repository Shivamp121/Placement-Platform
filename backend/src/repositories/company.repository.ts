import type { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
export class companyRepository{
    async createCompany(recruiterProfileId: string, data: Prisma.CompanyCreateWithoutRecruitersInput) {
    return prisma.company.create({
      data: {
        ...data,
        recruiters: {
          connect: { id: recruiterProfileId } 
        }
      }
    });
  }
    async getCompany(id:string){
    return prisma.company.findUnique({
        where:{id},
    })
}

    async updateCompany(id:string,data:Prisma.CompanyUncheckedCreateInput){
    return prisma.company.update({
        where:{id},
        data
    })
}
}

