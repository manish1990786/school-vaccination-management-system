import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.use(isAuthenticated);

router.get("/stats", dashboardController.getDashboardStats);
router.get("/vaccination-stats", dashboardController.getVaccinationStats);

export default router;