import { z } from "zod";

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"], {
      message: "Invalid application status value.",
    }),
  }),
});