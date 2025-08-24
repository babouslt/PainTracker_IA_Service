import { Router } from "express";
import { generateMedicalAnalysis } from "../controllers/ai.controller";
import { validateMedicalData, validation } from "../middlewares/validators";

const router = Router();

// Nouvelle route d'analyse médicale sans upload d'image
router.post(
  "/analyze",
  validateMedicalData,
  validation,
  generateMedicalAnalysis
);

export default router;
