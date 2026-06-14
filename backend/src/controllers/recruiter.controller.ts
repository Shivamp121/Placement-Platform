import type { Request, Response } from "express";
import { RecruiterService } from "../services/recruiter.service.js";

const recruiterService = new RecruiterService();

export const createRecruiterProfileController = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await recruiterService.createRecruiterProfile(userId, req.body);
    
    return res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};