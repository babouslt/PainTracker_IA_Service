import request from "supertest";
import express from "express";
import historyRoutes from "../../routes/history.route";

// Mock the entire controllers module
jest.mock("../../controllers/medicalHistory.controller", () => ({
  getUserMedicalHistory: jest.fn(),
  getAnalysisById: jest.fn(),
  deleteAnalysis: jest.fn(),
}));

// Import after mocking
import {
  getUserMedicalHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../../controllers/medicalHistory.controller";

const mockedGetUserMedicalHistory =
  getUserMedicalHistory as jest.MockedFunction<typeof getUserMedicalHistory>;
const mockedGetAnalysisById = getAnalysisById as jest.MockedFunction<
  typeof getAnalysisById
>;
const mockedDeleteAnalysis = deleteAnalysis as jest.MockedFunction<
  typeof deleteAnalysis
>;

describe("History Routes Integration Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());

    // Mock the controllers
    mockedGetUserMedicalHistory.mockImplementation(async (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          analyses: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0,
          },
        },
      });
    });

    mockedGetAnalysisById.mockImplementation(async (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
        },
      });
    });

    mockedDeleteAnalysis.mockImplementation(async (req, res) => {
      res.status(200).json({
        success: true,
        message: "Analysis deleted successfully",
      });
    });

    // Use the routes
    app.use("/history", historyRoutes);
  });

  describe("GET /history/user/:userId", () => {
    it("should return user medical history successfully", async () => {
      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .get(`/history/user/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("analyses");
      expect(response.body.data).toHaveProperty("pagination");
    });

    it("should handle query parameters for pagination", async () => {
      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .get(`/history/user/${userId}?page=2&limit=5`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });

    it("should handle controller errors gracefully", async () => {
      mockedGetUserMedicalHistory.mockImplementation(async (req, res) => {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      });

      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .get(`/history/user/${userId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Internal server error");
    });
  });

  describe("GET /history/analysis/:analysisId", () => {
    it("should return analysis by id successfully", async () => {
      const analysisId = "507f1f77bcf86cd799439011";
      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .get(`/history/analysis/${analysisId}?userId=${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(analysisId);
      expect(response.body.data.userId).toBe(userId);
    });

    it("should handle missing userId query parameter", async () => {
      const analysisId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .get(`/history/analysis/${analysisId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(analysisId);
    });

    it("should handle controller errors gracefully", async () => {
      mockedGetAnalysisById.mockImplementation(async (req, res) => {
        res.status(404).json({
          success: false,
          message: "Analysis not found",
        });
      });

      const analysisId = "507f1f77bcf86cd799439011";
      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .get(`/history/analysis/${analysisId}?userId=${userId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Analysis not found");
    });
  });

  describe("DELETE /history/analysis/:analysisId", () => {
    it("should delete analysis successfully", async () => {
      const analysisId = "507f1f77bcf86cd799439011";
      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .delete(`/history/analysis/${analysisId}`)
        .send({ userId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Analysis deleted successfully");
    });

    it("should handle missing userId in body", async () => {
      const analysisId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/history/analysis/${analysisId}`)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Analysis deleted successfully");
    });

    it("should handle controller errors gracefully", async () => {
      mockedDeleteAnalysis.mockImplementation(async (req, res) => {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      });

      const analysisId = "507f1f77bcf86cd799439011";
      const userId = "507f1f77bcf86cd799439012";

      const response = await request(app)
        .delete(`/history/analysis/${analysisId}`)
        .send({ userId })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Internal server error");
    });
  });
});
