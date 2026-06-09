import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middelwares/auth.middelware.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});
app.use("/auth",authRoutes);

app.get("/profile",protect,(req, res) => {
    res.json({
      message:"Protected Route",
    });
  }
);



export default app;