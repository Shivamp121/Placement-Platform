import{z} from "zod";
export const companySchema=z.object({
  name: z.string(),
  website: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  size: z.number().optional(),
})