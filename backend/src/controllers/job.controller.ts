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

export const getJobByIdController=async(req:Request,res:Response)=>{
  try{
    const { id } = req.params;
  let job;
  if (typeof id === 'string') {
     job=await jobRepo.getJobByIdService(id);
  }
  return res.status(201).json({
    success:true,
    job
  })
  }catch(error:any){
    return res.status(400).json({
      success:false,
      error:error.message
    })
  }
  
}

export const updateJobByIdController=async(req:any,res:Response)=>{
  try{
    const userId=req.user.id;
  const jobId=req.params.id;
  const result=await jobRepo.updateJobByIdService(jobId,userId,req.body);
  return res.status(201).json({
    success:true,
    result
  })    
  }catch(error:any){
    return res.status(400).json({
      success:false,
      error:error.message
    })
  }
}

export const deleteJobController = async (req: any, res: Response) => {
  try {
    await jobRepo.deleteJobService(req.user.id, req.params.id);
    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const getJobsController = async (req: Request, res: Response) => {
  try {
    const result = await jobRepo.getPublicJobs(req.query);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
