import { aiClient } from "../config/gemini.js";
import { Type } from "@google/genai";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws.js";
import prisma from "../config/prisma.js";
import { pdfToText } from "pdf-ts";
export class AtsService {
  private async extractTextFromPdf(fileUrl: string): Promise<string> {
    try {
      const keyMatch = fileUrl.match(/(resumes\/.*)/);
      if (!keyMatch || !keyMatch[1]) {
        throw new Error("Could not extract S3 Key from URL");
      }
      const s3Key = decodeURIComponent(keyMatch[1]);

      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error("AWS_S3_BUCKET_NAME environment variable is not defined.");
      }

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });

      const response = await s3Client.send(command);

      if (!response.Body) {
        throw new Error("S3 Response body is empty");
      }
      const byteArray = await (response.Body as any).transformToByteArray();
      const buffer = Buffer.from(byteArray);
      const text = await pdfToText(buffer);
      return text;

    } catch (error: any) {
      throw new Error(`PDF Extraction Error: ${error.message}`);
    }
  }
  

  async evaluateResumeForJob(userId: string, jobId: string) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new Error("Student profile not found.");
    
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job not found.");
    
    const prompt = `
      Act as an expert Technical Recruiter and ATS (Applicant Tracking System).
      Evaluate the candidate's profile against the job description.
      
      Job Title: ${job.title}
      Job Requirements: ${job.requirements.join(', ')}
      Job Description: ${job.description}
      
      Candidate Degree: ${student.degree} in ${student.branch}
      Candidate Skills: ${student.skills.join(', ')}
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER, description: "Match percentage out of 100." },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["atsScore", "missingSkills", "improvementSuggestions"]
        }
      }
    });
    const resultText = response.text;
    if (!resultText) throw new Error("Failed to generate AI evaluation.");
    return JSON.parse(resultText);
  }

  async evaluateGeneralResume(fileUrl: string) {
    const resumeText = await this.extractTextFromPdf(fileUrl);

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("Could not extract readable text from PDF.");
    }

    const prompt = `
      Act as an elite ATS system. Evaluate this standalone resume text based on formatting, impact, and clarity.
      Resume Text:
      ${resumeText}
    `;

    const aiResponse = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["atsScore", "feedback"]
        }
      }
    });
    const aiResultText = aiResponse.text;
    if (!aiResultText) throw new Error("Failed to parse general resume.");
    return JSON.parse(aiResultText);
  }
}