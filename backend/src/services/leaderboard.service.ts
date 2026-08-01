import { redisClient } from "../config/redis.js";

export class LeaderboardService {
  async addPoints(contestId: string, userId: string, points: number) {
    const leaderboardKey = `contest:${contestId}:leaderboard`;
    await redisClient.zIncrBy(leaderboardKey, points, userId);
  }
  async getTopPlayers(contestId: string, limit: number = 10) {
    const leaderboardKey = `contest:${contestId}:leaderboard`;
    const topPlayers = await redisClient.zRangeWithScores(
      leaderboardKey, 
      0, 
      limit - 1, 
      { REV: true }
    );
    return topPlayers.map((player) => ({
      userId: player.value,
      score: player.score
    }));
  }
}