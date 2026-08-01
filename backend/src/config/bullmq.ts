import { Redis } from "ioredis";
export const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

connection.on("error", (err) => console.error("BullMQ Redis Error", err));
connection.on("ready", () => console.log("BullMQ Redis Connected Successfully"));