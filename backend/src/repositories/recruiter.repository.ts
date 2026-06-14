import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";
export class recruiterRepository{
    async getRecruiterById(userId:string){
        return await prisma.recruiterProfile.findUnique({
      where: { userId },
      include: { companies: { select: { id: true } } } 
    });
    }
    async createProfile(data: Prisma.RecruiterProfileUncheckedCreateInput) {
    return await prisma.recruiterProfile.create({
      data
    });
  }
}