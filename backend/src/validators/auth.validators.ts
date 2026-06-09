import { PassThrough } from "node:stream";
import {email, z} from "zod";
export const registerSchema = z.object({
    email:z.email(),
    password:z.string().min(6),
    role:z.enum([
    "STUDENT",
    "RECRUITER",
    "ADMIN",
    ]),

});
export const loginSchema=z.object({
    email:z.email(),
    password:z.string(),

});