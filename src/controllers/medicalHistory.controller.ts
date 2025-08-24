import { Request, Response } from "express";
import MedicalAnalysis from "../models/medicalAnalysis.model";

export const getUserMedicalHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const analyses = await MedicalAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .select("-__v");

    const total = await MedicalAnalysis.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        analyses,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving history:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving history",
    });
  }
};

export const getAnalysisById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { analysisId } = req.params;
    const { userId } = req.query;

    const analysis = await MedicalAnalysis.findOne({
      _id: analysisId,
      userId: userId,
    }).select("-__v");

    if (!analysis) {
      res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Error retrieving analysis:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving analysis",
    });
  }
};

export const deleteAnalysis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { analysisId } = req.params;
    const { userId } = req.body;

    const analysis = await MedicalAnalysis.findOneAndDelete({
      _id: analysisId,
      userId: userId,
    });

    if (!analysis) {
      res.status(404).json({
        success: false,
        message: "Analysis not found or you don't have permission to delete it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting analysis",
    });
  }
};
