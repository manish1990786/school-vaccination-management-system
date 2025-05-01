import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import studentRoutes from "./routes/student.route";
import vaccinationDriveRoutes from "./routes/vaccination-drive.route";
import vaccinationRoutes from "./routes/vaccination.route";
import dashboardRoutes from "./routes/dashboard.route";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors({
    origin: true,
    credentials: true
  }));

  const apiRouter = express.Router();

  apiRouter.get("/status", (req, res) => {
    res.json({ status: "ok" });
  });

  try {

    console.log("Registering auth routes...");
    apiRouter.use("/auth", authRoutes);
    
    console.log("Registering student routes...");
    apiRouter.use("/students", studentRoutes);
    
    console.log("Registering vaccination-drives routes...");
    apiRouter.use("/vaccination-drives", vaccinationDriveRoutes);
    
    console.log("Registering vaccination routes...");
    apiRouter.use("/vaccinations", vaccinationRoutes);
    
    console.log("Registering dashboard routes...");
    apiRouter.use("/dashboard", dashboardRoutes);
    
    console.log("All routes registered successfully");
  } catch (error) {
    console.error("Error registering routes:", error);
  }
  
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("API Error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}