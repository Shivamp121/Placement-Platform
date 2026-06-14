import { recruiterRepository } from "../repositories/recruiter.repository.js";

const recruiterRepo = new recruiterRepository();

export class RecruiterService {
  async createRecruiterProfile(userId: string, data: any) {
    // 1. Check if profile already exists
    const existingProfile = await recruiterRepo.getRecruiterById(userId);
    if (existingProfile) {
      throw new Error("Recruiter profile already exists.");
    }
    const newProfile = await recruiterRepo.createProfile({
      userId,
      designation: data.designation
    });

    return newProfile;
  }
}