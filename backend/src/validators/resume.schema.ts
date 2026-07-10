import { z } from "zod";

export const generateUploadUrlSchema = z.object({
  body: z.object({
    fileName: z.string().min(3, "File name is required"),
    contentType: z.string().refine((val) => val === 'application/pdf', {
      message: "Only PDF files are allowed",
    }),
  }),
});

export const saveResumeSchema = z.object({
  body: z.object({
    fileName: z.string(),
    fileUrl: z.string().url("Must be a valid S3 URL"),
  }),
});