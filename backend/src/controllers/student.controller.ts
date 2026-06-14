import { type Request,type Response } from "express";
import { createStudentProfile, deleteStudentProfile, getStudentDashboardData, getStudentProfile, updateStudentProfile } from "../services/student.service.js";
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

export const updateStudentProfileController= async(req:any,res:Response)=>{
    try{
        const userId=req.user.id;
        const result=await updateStudentProfile(userId,req.body);
        return res.status(201).json({
            result
        })
    }catch(error:any){
        return res.status(400).json({
            message:error.message
        })
    }
}

export const deleteStudentProfileController=async(req:any,res:Response)=>{
    try{
        await deleteStudentProfile(req.user.id);
        return res.status(200).json({
            message:"Profile deleted"
        })
    }catch(error:any){
        return res.status(400).json({
            message:error.message
        })
    }
}

export const getStudentDashboardDataController=async(req:any,res:Response)=>{
    try{
        const result=await getStudentDashboardData(req.user.id);
        return res.status(200).json({
            result
        })    
    }catch(error:any){
        return res.status(400).json({
            message:error.message
        })
    }
}



