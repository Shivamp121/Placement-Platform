import {email, z} from "zod";
export const createStudentSchema=z.object({
    firstName: z.string(),
    lastName:z.string(),
    college:z.string(),
    degree:z.string(),
    branch:z.string(),
    graduationYear:z.number(),
    githubUrl:z.string().optional(),
    linkedinUrl:z.string().optional()
});