import prisma from "../config/prisma.js";

export class AnalyticsService {
  
  async getJobDashboardMetrics(userId: string, jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job not found.");
    if (job.recruiterId !== userId) throw new Error("Forbidden: You do not own this job posting.");
    const pipelineData = await prisma.application.groupBy({
      by: ['status'],
      where: { jobId },
      _count: {
        _all: true
      }
    });
    const scoreData = await prisma.application.aggregate({
      where: { jobId },
      _avg: { atsScore: true },
      _max: { atsScore: true },
      _min: { atsScore: true },
      _count: { _all: true }
    });
    const formattedPipeline = pipelineData.map(item => ({
      status: item.status,
      count: item._count._all
    }));

    return {
      totalApplicants: scoreData._count._all,
      atsMetrics: {
        averageScore: Math.round(scoreData._avg.atsScore || 0),
        highestScore: scoreData._max.atsScore || 0,
        lowestScore: scoreData._min.atsScore || 0
      },
      pipeline: formattedPipeline
    };
  }
}