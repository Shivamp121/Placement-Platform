import type{ Request, Response } from "express";
import { ContestService } from "../services/contest.service.js";
import { LeaderboardService } from "../services/leaderboard.service.js";
import { getIO } from "../config/socket.js";

const contestService = new ContestService();
const leaderboardService = new LeaderboardService();

export class ContestController {
  async submitChallenge(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { challengeId } = req.params;
      const { language, sourceCode } = req.body;
      if (!challengeId || typeof challengeId !== "string") {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid or missing challengeId parameter" 
        });
      }
      const result = await contestService.submitCode(userId, challengeId, language, sourceCode);
      if (result.judgeResult.status.id === 3) {
        const contestId = result.contestId;
        await leaderboardService.addPoints(contestId, userId, 10);
        const updatedLeaderboard = await leaderboardService.getTopPlayers(contestId);
        const io = getIO();
        io.to(`contest_${contestId}`).emit("leaderboard:update", updatedLeaderboard);
      }

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}