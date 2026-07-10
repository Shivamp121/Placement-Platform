import type { Request, Response } from "express";
import { AtsService } from "../services/ats.service.js";

const atsService = new AtsService();

export const evaluateApplicationController = async (req: any, res: Response) => {
  try {
    const { jobId } = req.params;
    const result = await atsService.evaluateResume(req.user.id, jobId);
    
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