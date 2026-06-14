import type { Prisma } from "@prisma/client";
import { jobRepositorty } from "../repositories/job.repository.js";
import { recruiterRepository } from "../repositories/recruiter.repository.js";

const jobRepo=new jobRepositorty();
const recruiterRepo=new recruiterRepository;
export class jobService {
  async createjobService(userId: string, jobData: Prisma.JobUncheckedCreateInput) {
    const recruiterProfile = await recruiterRepo.getRecruiterById(userId);

    if (!recruiterProfile)
        throw new Error("You are not a recruiter");

    const isAuthorized = recruiterProfile.companies.some(
      (company) => company.id === jobData.companyId
    );
    if (!isAuthorized) {
      throw new Error("Forbidden: You are not authorized to post jobs for this company.");
    }
    const newJob = await jobRepo.createJob({
      ...jobData,
      recruiterId: userId 
    });
    
    return newJob;
  }
  async getAllJobs(filters: Prisma.JobWhereInput = {}) {
    const jobs = await jobRepo.getAllJob(filters);
    return jobs;
  }
}
