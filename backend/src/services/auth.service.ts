import bcrypt from "bcrypt";
import {
    createUser,
    findUserByEmail
} from "../repositories/user.repository.js";
import type { Role } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";
export const registerUser = async(email:string,password:string,role:Role)=>{
    const existingUser=await findUserByEmail(email);
    if(existingUser){
        throw new Error("User already exists");
    }
    const hashedPassword =await bcrypt.hash(password,10);
    return createUser(
        email,
        hashedPassword,
        role
    );
;}

export const loginUser=async(email:string,password:string)=>{
const user=await findUserByEmail(email);
if(!user){
    throw new Error(
        "Invalid credentials"
    )
}
const isMatch=await bcrypt.compare(password, user.password);
if(!isMatch){
    throw new Error(
        "Password is incorrect"
    )
}
const token=generateToken(user.id,user.role);
return {
    user,token
}
}