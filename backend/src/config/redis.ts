import { createClient } from "redis";
import Redis from "ioredis";
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL environment variable");
}

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Connected Successfully"));
redisClient.connect().catch(console.error);