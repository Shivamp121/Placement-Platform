import type { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service.js";

const analyticsService = new AnalyticsService();

export const getJobDashboardMetricsController = async (req: any, res: Response) => {
  try {
    const { jobId } = req.params;
    const metrics = await analyticsService.getJobDashboardMetrics(req.user.id, jobId);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};