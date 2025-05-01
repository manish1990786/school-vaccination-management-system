import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user", isAuthenticated, authController.getCurrentUser);
router.post("/register", authController.register);

export default router;