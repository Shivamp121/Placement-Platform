import{z} from "zod"
export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
    salaryRange: z.string().optional(),
    location: z.string().min(2, "Location is required"),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']).optional(),
    companyId: z.string().uuid("Valid Company ID is required"), // ADDED BACK
  }),
});
export const updateJobSchema=z.object({
  body:createJobSchema.shape.body.partial(),
})