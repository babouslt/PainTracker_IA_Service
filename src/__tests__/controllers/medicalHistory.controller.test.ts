import { Request, Response } from "express";
import {
  getUserMedicalHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../../controllers/medicalHistory.controller";
import MedicalAnalysis from "../../models/medicalAnalysis.model";

// Mock MedicalAnalysis model
jest.mock("../../models/medicalAnalysis.model");

const mockedMedicalAnalysis = MedicalAnalysis as jest.Mocked<
  typeof MedicalAnalysis
>;

describe("MedicalHistory Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAnalysis: any;

  beforeEach(() => {
    // Mock response methods
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock analysis data
    mockAnalysis = {
      _id: "507f1f77bcf86cd799439011",
      userId: "507f1f77bcf86cd799439011",
      requestData: {
        age: 30,
        sexe: "Male",
        taille: 175,
        poids: 70,
        symptomes: "Douleur au genou droit",
        niveauDouleur: 7,
        localisationDouleur: "Genou droit",
      },
      responseData: {
        response:
          "🔹 1. Diagnostic Test\nSymptômes : Test\nCause : Test\nTraitement : Test\nTests : Test",
        usage: {
          prompt_tokens: 150,
          completion_tokens: 200,
          total_tokens: 350,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe("getUserMedicalHistory", () => {
    it("should retrieve user medical history successfully", async () => {
      mockRequest = {
        params: { userId: "507f1f77bcf86cd799439011" },
        query: { page: "1", limit: "10" },
      };

      // Mock the chained methods
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([mockAnalysis]),
      };
      mockedMedicalAnalysis.find.mockReturnValue(mockFind as any);
      mockedMedicalAnalysis.countDocuments.mockResolvedValue(1);

      await getUserMedicalHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          analyses: [mockAnalysis],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            pages: 1,
          },
        },
      });
    });

    it("should handle pagination correctly", async () => {
      mockRequest = {
        params: { userId: "507f1f77bcf86cd799439011" },
        query: { page: "2", limit: "5" },
      };

      // Mock the chained methods
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([mockAnalysis]),
      };
      mockedMedicalAnalysis.find.mockReturnValue(mockFind as any);
      mockedMedicalAnalysis.countDocuments.mockResolvedValue(25);

      await getUserMedicalHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          analyses: [mockAnalysis],
          pagination: {
            page: 2,
            limit: 5,
            total: 25,
            pages: 5,
          },
        },
      });
    });

    it("should use default pagination values when not provided", async () => {
      mockRequest = {
        params: { userId: "507f1f77bcf86cd799439011" },
        query: {},
      };

      // Mock the chained methods
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([mockAnalysis]),
      };
      mockedMedicalAnalysis.find.mockReturnValue(mockFind as any);
      mockedMedicalAnalysis.countDocuments.mockResolvedValue(1);

      await getUserMedicalHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          analyses: [mockAnalysis],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            pages: 1,
          },
        },
      });
    });

    it("should handle database errors", async () => {
      mockRequest = {
        params: { userId: "507f1f77bcf86cd799439011" },
        query: {},
      };

      mockedMedicalAnalysis.find.mockImplementation(() => {
        throw new Error("Database error");
      });

      await getUserMedicalHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error retrieving history",
      });
    });
  });

  describe("getAnalysisById", () => {
    it("should retrieve analysis by ID successfully", async () => {
      mockRequest = {
        params: { analysisId: "507f1f77bcf86cd799439011" },
        query: { userId: "507f1f77bcf86cd799439011" },
      };

      // Mock the chained methods for findOne().select()
      const mockFindOne = {
        select: jest.fn().mockResolvedValue(mockAnalysis),
      };
      mockedMedicalAnalysis.findOne.mockReturnValue(mockFindOne as any);

      await getAnalysisById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAnalysis,
      });
    });

    it("should return 404 when analysis is not found", async () => {
      mockRequest = {
        params: { analysisId: "507f1f77bcf86cd799439011" },
        query: { userId: "507f1f77bcf86cd799439011" },
      };

      // Mock the chained methods for findOne().select()
      const mockFindOne = {
        select: jest.fn().mockResolvedValue(null),
      };
      mockedMedicalAnalysis.findOne.mockReturnValue(mockFindOne as any);

      await getAnalysisById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Analysis not found",
      });
    });

    it("should handle database errors", async () => {
      mockRequest = {
        params: { analysisId: "507f1f77bcf86cd799439011" },
        query: { userId: "507f1f77bcf86cd799439011" },
      };

      mockedMedicalAnalysis.findOne.mockImplementation(() => {
        throw new Error("Database error");
      });

      await getAnalysisById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error retrieving analysis",
      });
    });
  });

  describe("deleteAnalysis", () => {
    it("should delete analysis successfully", async () => {
      mockRequest = {
        params: { analysisId: "507f1f77bcf86cd799439011" },
        body: { userId: "507f1f77bcf86cd799439011" },
      };

      mockedMedicalAnalysis.findOneAndDelete.mockResolvedValue(mockAnalysis);

      await deleteAnalysis(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Analysis deleted successfully",
      });
    });

    it("should return 404 when analysis is not found", async () => {
      mockRequest = {
        params: { analysisId: "507f1f77bcf86cd799439011" },
        body: { userId: "507f1f77bcf86cd799439011" },
      };

      mockedMedicalAnalysis.findOneAndDelete.mockResolvedValue(null);

      await deleteAnalysis(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Analysis not found or you don't have permission to delete it",
      });
    });

    it("should handle database errors", async () => {
      mockRequest = {
        params: { analysisId: "507f1f77bcf86cd799439011" },
        body: { userId: "507f1f77bcf86cd799439011" },
      };

      mockedMedicalAnalysis.findOneAndDelete.mockImplementation(() => {
        throw new Error("Database error");
      });

      await deleteAnalysis(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error deleting analysis",
      });
    });
  });
});
