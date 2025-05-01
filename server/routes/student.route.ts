import { Router } from "express";
import * as studentController from "../controllers/student.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(isAuthenticated);

router.get("/", studentController.getAllStudentsHandler);
router.get("/student-id/:studentId", studentController.getStudentByStudentIdHandler);
router.get("/:id", studentController.getStudentByIdHandler);
router.post("/", studentController.createStudentHandler);
router.put("/:id", studentController.updateStudentHandler);
router.delete("/:id", studentController.deleteStudentHandler);
router.post("/bulk", studentController.bulkCreateStudentsHandler);
router.post("/import-csv", upload.single("file"), studentController.importStudentsFromCSVHandler);

export default router;