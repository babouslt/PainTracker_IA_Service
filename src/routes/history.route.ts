import express from "express";
import {
  getUserMedicalHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/medicalHistory.controller";

const router = express.Router();

// GET /api/history/user/:userId - Récupérer l'historique médical d'un utilisateur
router.get("/user/:userId", getUserMedicalHistory);

// GET /api/history/:userId - Récupérer l'historique médical d'un utilisateur (route alternative)
router.get("/:userId", getUserMedicalHistory);

// GET /api/history/analysis/:analysisId - Récupérer une analyse spécifique
router.get("/analysis/:analysisId", getAnalysisById);

// DELETE /api/history/analysis/:analysisId - Supprimer une analyse
router.delete("/analysis/:analysisId", deleteAnalysis);

export default router;
