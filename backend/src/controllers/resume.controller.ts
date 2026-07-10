import type { Request, Response } from "express";
import { ResumeService } from "../services/resume.service.js";

const resumeService = new ResumeService();

export const generateUploadUrlController = async (req: any, res: Response) => {
  try {
    const { fileName, contentType } = req.body;
    const result = await resumeService.getPresignedUrl(req.user.id, fileName, contentType);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const saveResumeController = async (req: any, res: Response) => {
  try {
    const { fileName, fileUrl } = req.body;
    const result = await resumeService.saveResume(req.user.id, fileName, fileUrl);
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyResumesController = async (req: any, res: Response) => {
  try {
    const result = await resumeService.getMyResumes(req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};