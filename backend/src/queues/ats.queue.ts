import { Queue } from "bullmq";
import { connection } from "../config/bullmq.js";
export const atsQueue = new Queue("ats-parsing-queue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, 
    },
    removeOnComplete: true,
  },
});