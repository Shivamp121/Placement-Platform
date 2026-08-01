import type { Request, Response } from "express";
import { ApplicationService } from "../services/application.service.js";
import { getIO } from "../config/socket.js";
import prisma from "../config/prisma.js";
import { EmailService } from "../services/email.service.js";
const emailService = new EmailService();
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
      include: { 
        job: true, 
        student: {
          include: {
            user: { select: { email: true, name: true } }
          }
        } 
      }
    });

    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    
    if (application.job.recruiterId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not manage this job posting." });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });

    const io = getIO();
    io.to(application.student.userId).emit("notification:application_update", {
      jobTitle: application.job.title,
      status: updated.status,
      message: `Your application status for ${application.job.title} has been updated to ${updated.status}.`
    });
    const studentEmail = application.student.user.email;
    const studentName = application.student.user.name || "Student";

    if (studentEmail) {
      const subject = `Application Update: ${application.job.title}`;
      const htmlContent = `
        <h2>Application Status Updated</h2>
        <p>Hi ${studentName},</p>
        <p>Your application for <strong>${application.job.title}</strong> has been updated to <strong>${updated.status}</strong>.</p>
        <p>Log in to your portal dashboard to view details.</p>
      `;
      emailService.sendEmail(studentEmail, subject, htmlContent);
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};