import { type Request,type Response } from "express";
import { createStudentProfile, getStudentProfile } from "../services/student.service.js";
export const createProfile=async (req:any,res:Response)=>{
    try{
        const profile=await createStudentProfile({
            ...req.body,
            userId:req.user.id
        });
        res.status(201).json({
            profile
        })
    }catch(error:any){
        res.status(400).json({
            message:error.message
        })
    }
}

export const getStudentProfileController=async(req:any,res:Response)=>{
    try{
        const userId=req.user.id;
        const result=await getStudentProfile(userId);
        return res.status(201).json({
            result
        })
    }catch(error:any){
        return res.status(400).json({
            message:error.message
        })
    }
}
