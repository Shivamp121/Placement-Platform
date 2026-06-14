import { type Request,type Response } from "express"
import { companyService } from "../services/company.service.js"
import { recruiterRepository } from "../repositories/recruiter.repository.js";
const companyServiceClass=new companyService();
const recruiterRepo=new recruiterRepository();
export const createCompanyController=async(req:any,res:Response)=>{
try{
    const userId=req.user.id;
    const result=await companyServiceClass.createCompanyService(userId,req.body);
    return res.status(200).json({
        result
    })
}catch(error:any){
    return res.status(400).json({
        message:error.message
    })
}
}

export const getCompanyController=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params;
        if(!id||typeof id!=='string')
            return res.status(400).json({
        message:"Invalid or Missing Id"
        })
        const result=await companyServiceClass.getCompanyService(id);
        if(!result)
            return res.status(400).json({
        message:"Company not found"
            })
            return res.status(200).json({
                result
            })
    }catch(error:any){
        return res.status(400).json({
            message:error.message
        })
    }
}

export const updateCompanyController=async(req:Request,res:Response)=>{
    try{
        const {id}=req.params;
        const {data}=req.body;
        if(!id||typeof id!=='string')
            return res.status(400).json({
        message:"Invalid or Missing Id"
        })
        if(!data)
        return res.status(400).json({
        message:"Data cannot be empty"
        })
        const result=await companyServiceClass.updateCompanyService(id,data);
        if(!result)
            return res.status(400).json({
        message:"Company not found"
            })
            return res.status(200).json({
                result
            })
    }catch(error:any){
        return res.status(400).json({
            message:error.message
        })
    }
}
export const getMyCompaniesController=async(req:any,res:Response)=>{
    try {
    const userId=req.user.id;
    console.log("Decoded User from Token:", req.user);
    const recruiterProfile=await recruiterRepo.getRecruiterById(userId);
    if (!recruiterProfile) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }
    return res.status(200).json({
      success: true,
      data: recruiterProfile.companies
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
