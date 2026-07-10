import type { Request, Response } from "express";
import { ApplicationService } from "../services/application.service.js";
import prisma from "../config/prisma.js";
const appService = new ApplicationService();
export const applyForJobController = async (req: any, res: Response) => {
  try {
    const result = await appService.applyForJob(req.user.id, req.params.jobId);
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const getJobApplicantsController = async (req: any, res: Response) => {
  try {
    const result = await appService.getApplicantsForJob(req.user.id, req.params.jobId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const getMyApplicationsController = async (req: any, res: Response) => {
  try {
    const result = await appService.getMyApplications(req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatusController = async (req: any, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    
    if (application.job.recruiterId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not manage this job posting." });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};