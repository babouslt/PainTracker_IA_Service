import { Request, Response } from "express";
import { generateMedicalAnalysis } from "../../controllers/ai.controller";

// Mock OpenAI
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Test response" } }],
          usage: {
            prompt_tokens: 100,
            completion_tokens: 200,
            total_tokens: 300,
          },
        }),
      },
    },
  }));
});

// Mock MedicalAnalysis model
jest.mock("../../models/medicalAnalysis.model", () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({ _id: "test-id" }),
  }));
});

describe("AI Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Mock response methods
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock request with valid data
    mockRequest = {
      body: {
        userId: "507f1f77bcf86cd799439011",
        age: 30,
        sexe: "Male",
        taille: 175,
        poids: 70,
        symptomes: "Douleur au genou droit",
        niveauDouleur: 7,
        localisationDouleur: "Genou droit",
      },
    };

    // Set OPENAI_API_KEY for tests
    process.env.OPENAI_API_KEY = "test-key";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMedicalAnalysis", () => {
    it("should return error when OPENAI_API_KEY is not configured", async () => {
      delete process.env.OPENAI_API_KEY;

      await generateMedicalAnalysis(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message:
          "OpenAI API key not configured. Please configure OPENAI_API_KEY in your .env file",
      });
    });

    it("should return error when userId is missing", async () => {
      const requestWithoutUserId = { ...mockRequest };
      delete requestWithoutUserId.body!.userId;

      await generateMedicalAnalysis(
        requestWithoutUserId as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["userId"],
      });
    });

    it("should return error when age is missing", async () => {
      const requestWithoutAge = { ...mockRequest };
      delete requestWithoutAge.body!.age;

      await generateMedicalAnalysis(
        requestWithoutAge as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["age"],
      });
    });

    it("should return error when sexe is missing", async () => {
      const requestWithoutSexe = { ...mockRequest };
      delete requestWithoutSexe.body!.sexe;

      await generateMedicalAnalysis(
        requestWithoutSexe as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["sexe"],
      });
    });

    it("should return error when taille is missing", async () => {
      const requestWithoutTaille = { ...mockRequest };
      delete requestWithoutTaille.body!.taille;

      await generateMedicalAnalysis(
        requestWithoutTaille as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["taille"],
      });
    });

    it("should return error when poids is missing", async () => {
      const requestWithoutPoids = { ...mockRequest };
      delete requestWithoutPoids.body!.poids;

      await generateMedicalAnalysis(
        requestWithoutPoids as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["poids"],
      });
    });

    it("should return error when symptomes is missing", async () => {
      const requestWithoutSymptomes = { ...mockRequest };
      delete requestWithoutSymptomes.body!.symptomes;

      await generateMedicalAnalysis(
        requestWithoutSymptomes as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["symptomes"],
      });
    });

    it("should return error when niveauDouleur is missing", async () => {
      const requestWithoutNiveauDouleur = { ...mockRequest };
      delete requestWithoutNiveauDouleur.body!.niveauDouleur;

      await generateMedicalAnalysis(
        requestWithoutNiveauDouleur as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["niveauDouleur"],
      });
    });

    it("should return error when localisationDouleur is missing", async () => {
      const requestWithoutLocalisationDouleur = { ...mockRequest };
      delete requestWithoutLocalisationDouleur.body!.localisationDouleur;

      await generateMedicalAnalysis(
        requestWithoutLocalisationDouleur as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["localisationDouleur"],
      });
    });

    it("should return error when multiple fields are missing", async () => {
      const requestWithMultipleMissing = { ...mockRequest };
      delete requestWithMultipleMissing.body!.age;
      delete requestWithMultipleMissing.body!.sexe;

      await generateMedicalAnalysis(
        requestWithMultipleMissing as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["age", "sexe"],
      });
    });

    it("should return error when field is empty string", async () => {
      const requestWithEmptyField = { ...mockRequest };
      requestWithEmptyField.body!.symptomes = "";

      await generateMedicalAnalysis(
        requestWithEmptyField as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["symptomes"],
      });
    });

    it("should return error when field is whitespace only", async () => {
      const requestWithWhitespaceField = { ...mockRequest };
      requestWithWhitespaceField.body!.symptomes = "   ";

      await generateMedicalAnalysis(
        requestWithWhitespaceField as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Incomplete data",
        missingFields: ["symptomes"],
      });
    });
  });
});
