import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL environment variable");
}

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Connected Successfully"));
redisClient.connect().catch(console.error);