import { aiClient } from "../config/gemini.js";
import { Type } from "@google/genai";
import prisma from "../config/prisma.js";

export class AtsService {
  async evaluateResume(userId: string, jobId: string) {
    const student = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!student) throw new Error("Student profile not found.");
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job not found.");
    const prompt = 
    `Act as an expert Technical Technical Recruiter and ATS (Applicant Tracking System).
      Evaluate the candidate's profile against the job description.
      
      Job Title: ${job.title}
      Job Requirements: ${job.requirements.join(', ')}
      Job Description: ${job.description}
      
      Candidate Degree: ${student.degree} in ${student.branch}
      Candidate Skills: ${student.skills.join(', ')}
      
      Calculate an ATS match score (0-100), identify strictly missing skills, and provide actionable improvement suggestions.
    `;
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { 
              type: Type.NUMBER, 
              description: "A score out of 100 representing the match percentage." 
            },
            missingSkills: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Technical skills required by the job but missing from the candidate's profile."
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Short, actionable tips for the candidate to improve their chances."
            }
          },
          required: ["atsScore", "missingSkills", "improvementSuggestions"]
        }
      }
    });
    if (!response.text) throw new Error("Failed to generate AI evaluation.");
    const evaluation = JSON.parse(response.text);

    return evaluation;
  }
}