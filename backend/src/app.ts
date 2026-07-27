import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middelwares/auth.middelware.js";
import adminRoutes from "./routes/admin.routes.js";
import companyRoutes from "./routes/company.routes.js";
import studentRoutes from "./routes/student.routes.js";
import jobRoutes from "./routes/job.routes.js"
import recruiterRoutes from "./routes/recruiter.routes.js"
import applicationRoutes from "./routes/application.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import { ensureBucketExists } from "./config/aws.js";
import atsRoutes from "./routes/ats.routes.js"
import analyticsRoutes from "./routes/analytics.route.js"


const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://hirebridge.me' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);


const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts from this IP, please try again after an hour',
});


await ensureBucketExists();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});
app.use("/auth", authLimiter, authRoutes);
app.use("/admin",adminRoutes);

app.use("/companies",companyRoutes);
app.use("/student",studentRoutes);
app.use("/jobs",jobRoutes);
app.use("/recruiters",recruiterRoutes);
app.use("/applications",applicationRoutes);
app.use("/resumes",resumeRoutes);
app.use("/ats",atsRoutes);
app.use("/analytics", analyticsRoutes)
app.get("/profile",protect,(req, res) => {
    res.json({
      message:"Protected Route",
    });
  }
);



export default app;