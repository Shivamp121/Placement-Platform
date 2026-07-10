import type { Prisma } from "@prisma/client";
import { jobRepositorty } from "../repositories/job.repository.js";
import { recruiterRepository } from "../repositories/recruiter.repository.js";
import { redisClient } from "../config/redis.js";
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
  async getJobByIdService(jobId:string){
    const job = await jobRepo.getJobById(jobId);
    if (!job) throw new Error("Job not found.");
    return job;
  }
  async updateJobByIdService(jobId:string,userId:string,data:Prisma.JobUpdateInput){
    const job = await this.getJobByIdService(jobId);
    if (job.recruiterId !== userId) {
      throw new Error("Forbidden: You can only modify jobs that you posted.");
    }
    return await jobRepo.updateJob(jobId, data);
  }
  async deleteJobService(userId: string, jobId: string) {
    const job = await this.getJobByIdService(jobId);
    if (job.recruiterId !== userId) {
      throw new Error("Forbidden: You can only delete jobs that you posted.");
    }
    return await jobRepo.deleteJob(jobId);
  }
  async getPublicJobs(queryParams: any) {
    const cacheKey = `jobs:page:${queryParams.page || 1}:limit:${queryParams.limit || 10}:search:${queryParams.search || ''}:loc:${queryParams.location || ''}:type:${queryParams.jobType || ''}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log(`CACHE HIT: Returning blazing fast data for key: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    console.log(`CACHE MISS: Querying PostgreSQL for key: ${cacheKey}`);
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const where: Prisma.JobWhereInput = { status: 'OPEN' };
    if (queryParams.search) {
      where.OR = [
        { title: { contains: queryParams.search, mode: 'insensitive' } },
        { description: { contains: queryParams.search, mode: 'insensitive' } }
      ];
    }
    if (queryParams.location) {
      where.location = { contains: queryParams.location, mode: 'insensitive' };
    }
    if (queryParams.jobType) {
      where.jobType = queryParams.jobType;
    }
    const { jobs, totalCount } = await jobRepo.getPaginatedJobs(where, skip, limit);
    const result = {
      jobs,
      pagination: {
        totalJobs: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    };
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 60 });
    return result;
  }
}
