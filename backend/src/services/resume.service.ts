import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws.js";
import { ResumeRepository } from "../repositories/resume.repository.js";
import prisma from "../config/prisma.js";
import crypto from "crypto";
import { atsQueue } from "../queues/ats.queue.js";
const resumeRepo = new ResumeRepository();

export class ResumeService {
  
  async getPresignedUrl(userId: string, fileName: string, contentType: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Student profile not found.");
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `resumes/${profile.id}/${uniqueId}-${safeFileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 180 });
    const finalFileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return { uploadUrl, fileUrl: finalFileUrl };
  }

  async saveResume(userId: string, fileName: string, fileUrl: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Student profile not found.");
    const resume = await resumeRepo.saveResumeRecord(profile.id, fileName, fileUrl);

    await atsQueue.add("parse-resume", {
      resumeId: resume.id,
      fileUrl: resume.fileUrl,
      userId:userId,
      studentId: profile.id
    });

    return resume;

  }
  
  async getMyResumes(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Student profile not found.");

    return await resumeRepo.getResumesByStudent(profile.id);
  }
}