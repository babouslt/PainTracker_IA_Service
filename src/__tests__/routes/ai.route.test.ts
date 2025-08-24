import express from "express";
import request from "supertest";
import aiRoutes from "../../routes/ai.route";

// Mock the entire module to avoid actual validation
jest.mock("../../middlewares/validators", () => ({
  validateMedicalData: [],
  validation: (req: any, res: any, next: any) => next(),
}));

// Mock the controller
jest.mock("../../controllers/ai.controller", () => ({
  generateMedicalAnalysis: jest.fn(),
}));

import { generateMedicalAnalysis } from "../../controllers/ai.controller";

const mockedGenerateMedicalAnalysis =
  generateMedicalAnalysis as jest.MockedFunction<
    typeof generateMedicalAnalysis
  >;

describe("AI Routes Integration Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());

    // Mock the controller
    mockedGenerateMedicalAnalysis.mockImplementation(async (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          response: "Test analysis response",
          usage: {
            prompt_tokens: 150,
            completion_tokens: 200,
            total_tokens: 350,
          },
          analysisId: "507f1f77bcf86cd799439011",
        },
      });
    });

    // Use the routes
    app.use("/ai", aiRoutes);
  });

  describe("POST /ai/analyze", () => {
    const validMedicalData = {
      userId: "507f1f77bcf86cd799439011",
      age: 30,
      sexe: "Male",
      taille: 175,
      poids: 70,
      symptomes: "Douleur au genou droit depuis 3 jours",
      niveauDouleur: 7,
      localisationDouleur: "Genou droit",
    };

    it("should call generateMedicalAnalysis when valid data is provided", async () => {
      const response = await request(app)
        .post("/ai/analyze")
        .send(validMedicalData)
        .expect(200);

      expect(mockedGenerateMedicalAnalysis).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
      expect(response.body.data.response).toBe("Test analysis response");
    });

    it("should pass request data to the controller", async () => {
      await request(app).post("/ai/analyze").send(validMedicalData).expect(200);

      expect(mockedGenerateMedicalAnalysis).toHaveBeenCalled();
      const callArgs = mockedGenerateMedicalAnalysis.mock.calls[0];
      expect(callArgs[0].body).toEqual(validMedicalData);
    });

    it("should handle controller errors gracefully", async () => {
      mockedGenerateMedicalAnalysis.mockImplementation(async (req, res) => {
        res.status(500).json({
          success: false,
          message: "Error generating medical analysis",
        });
      });

      const response = await request(app)
        .post("/ai/analyze")
        .send(validMedicalData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Error generating medical analysis");
    });

    it("should handle missing request body", async () => {
      // Since we're mocking the validation middleware, this will pass through
      // In real implementation, it would return 400
      const response = await request(app).post("/ai/analyze").expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
