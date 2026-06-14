import { type Request,type Response } from "express";
import { jobService } from "../services/job.service.js";
const jobRepo=new jobService();
export const createJobController= async (req:any,res:Response) => {
    try{
        const userId=req.user.id;
        const newJob=await jobRepo.createjobService(userId,req.body);
        return res.status(201).json({
            success:true,
            data:newJob
        })
    }catch(error:any){
        return res.status(403).json({
      success: false,
      message: error.message
    });
    }
}
export const getJobsController = async (req: Request, res: Response) => {
  try {
    const jobs = await jobRepo.getAllJobs(); 
    
    return res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};