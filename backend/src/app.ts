import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middelwares/auth.middelware.js";
import adminRoutes from "./routes/admin.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import studentRoutes from "./routes/student.route.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});
app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);

app.use("/recruiter",recruiterRoutes);
app.use("/student",studentRoutes);

app.get("/profile",protect,(req, res) => {
    res.json({
      message:"Protected Route",
    });
  }
);



export default app;