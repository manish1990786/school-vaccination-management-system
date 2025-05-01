import { Router } from "express";
import * as vaccinationDriveController from "../controllers/vaccination-drive.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.use(isAuthenticated);

router.get("/", vaccinationDriveController.getAllVaccinationDrives);
router.get("/upcoming", vaccinationDriveController.getUpcomingDrives);
router.get("/upcoming/:days", vaccinationDriveController.getUpcomingDrives);
router.get("/:id", vaccinationDriveController.getVaccinationDriveById);
router.post("/", vaccinationDriveController.createVaccinationDrive);
router.put("/:id", vaccinationDriveController.updateVaccinationDrive);
router.delete("/:id", vaccinationDriveController.deleteVaccinationDrive);
router.post("/:id/complete", vaccinationDriveController.markDriveAsCompleted);

export default router;