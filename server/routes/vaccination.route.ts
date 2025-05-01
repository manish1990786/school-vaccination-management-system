import { Router } from "express";
import * as vaccinationController from "../controllers/vaccination.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.use(isAuthenticated);

router.get("/", vaccinationController.getAllVaccinationsHandler);
router.get("/student/:studentId", vaccinationController.getVaccinationsByStudentHandler);
router.get("/drive/:driveId", vaccinationController.getVaccinationsByDriveHandler);
router.post("/", vaccinationController.createVaccinationHandler);
router.get("/check-status/:studentId", vaccinationController.checkStudentVaccinationStatusHandler);
router.get("/export-pdf", vaccinationController.exportVaccinationReportToPdfHandler);


export default router;