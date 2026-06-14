import { companyRepository } from "../repositories/company.repository.js"
import prisma from "../config/prisma.js";
const companyRepo=new companyRepository();
export class companyService{
    async createCompanyService (userId: string, data: any){
  const recruiterProfile = await prisma.recruiterProfile.findUnique({
    where: { userId }
  });

  if (!recruiterProfile) {
    throw new Error("Recruiter profile not found. Please complete your profile first.");
  }
  return companyRepo.createCompany(recruiterProfile.id, data);
};
async getCompanyService(id:string){
    return companyRepo.getCompany(id);
}
async updateCompanyService(id:string,data:any){
    return companyRepo.updateCompany(id,data);
}
}
