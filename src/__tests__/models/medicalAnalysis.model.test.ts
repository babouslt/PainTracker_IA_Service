import mongoose from "mongoose";
import MedicalAnalysis from "../../models/medicalAnalysis.model";

describe("MedicalAnalysis Model", () => {
  const validAnalysisData = {
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
  };

  // Helper function to create deep copies
  const createValidCopy = () => ({
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
  });

  beforeEach(async () => {
    await MedicalAnalysis.deleteMany({});
  });

  describe("Validation", () => {
    it("should create a valid medical analysis", async () => {
      const analysis = new MedicalAnalysis(validAnalysisData);
      const savedAnalysis = await analysis.save();

      expect(savedAnalysis._id).toBeDefined();
      expect(savedAnalysis.userId).toBe(validAnalysisData.userId);
      expect(savedAnalysis.requestData.age).toBe(
        validAnalysisData.requestData.age
      );
      expect(savedAnalysis.requestData.sexe).toBe(
        validAnalysisData.requestData.sexe
      );
      expect(savedAnalysis.requestData.taille).toBe(
        validAnalysisData.requestData.taille
      );
      expect(savedAnalysis.requestData.poids).toBe(
        validAnalysisData.requestData.poids
      );
      expect(savedAnalysis.requestData.symptomes).toBe(
        validAnalysisData.requestData.symptomes
      );
      expect(savedAnalysis.requestData.niveauDouleur).toBe(
        validAnalysisData.requestData.niveauDouleur
      );
      expect(savedAnalysis.requestData.localisationDouleur).toBe(
        validAnalysisData.requestData.localisationDouleur
      );
      expect(savedAnalysis.responseData.response).toBe(
        validAnalysisData.responseData.response
      );
      expect(savedAnalysis.responseData.usage.prompt_tokens).toBe(
        validAnalysisData.responseData.usage.prompt_tokens
      );
      expect(savedAnalysis.responseData.usage.completion_tokens).toBe(
        validAnalysisData.responseData.usage.completion_tokens
      );
      expect(savedAnalysis.responseData.usage.total_tokens).toBe(
        validAnalysisData.responseData.usage.total_tokens
      );
    });

    it("should require userId", async () => {
      const analysisWithoutUserId = { ...validAnalysisData };
      delete analysisWithoutUserId.userId;

      const analysis = new MedicalAnalysis(analysisWithoutUserId);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["userId"]).toBeDefined();
    });

    it("should require age in requestData", async () => {
      const analysisWithoutAge = { ...validAnalysisData };
      delete analysisWithoutAge.requestData.age;

      const analysis = new MedicalAnalysis(analysisWithoutAge);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.age"]).toBeDefined();
    });

    it("should require sexe in requestData", async () => {
      const analysisWithoutSexe = { ...validAnalysisData };
      delete analysisWithoutSexe.requestData.sexe;

      const analysis = new MedicalAnalysis(analysisWithoutSexe);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.sexe"]).toBeDefined();
    });

    it("should require taille in requestData", async () => {
      const analysisWithoutTaille = { ...validAnalysisData };
      delete analysisWithoutTaille.requestData.taille;

      const analysis = new MedicalAnalysis(analysisWithoutTaille);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.taille"]).toBeDefined();
    });

    it("should require poids in requestData", async () => {
      const analysisWithoutPoids = { ...validAnalysisData };
      delete analysisWithoutPoids.requestData.poids;

      const analysis = new MedicalAnalysis(analysisWithoutPoids);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.poids"]).toBeDefined();
    });

    it("should require symptomes in requestData", async () => {
      const analysisWithoutSymptomes = { ...validAnalysisData };
      delete analysisWithoutSymptomes.requestData.symptomes;

      const analysis = new MedicalAnalysis(analysisWithoutSymptomes);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.symptomes"]).toBeDefined();
    });

    it("should require niveauDouleur in requestData", async () => {
      const analysisWithoutNiveauDouleur = { ...validAnalysisData };
      delete analysisWithoutNiveauDouleur.requestData.niveauDouleur;

      const analysis = new MedicalAnalysis(analysisWithoutNiveauDouleur);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.niveauDouleur"]).toBeDefined();
    });

    it("should require localisationDouleur in requestData", async () => {
      const analysisWithoutLocalisationDouleur = { ...validAnalysisData };
      delete analysisWithoutLocalisationDouleur.requestData.localisationDouleur;

      const analysis = new MedicalAnalysis(analysisWithoutLocalisationDouleur);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.localisationDouleur"]).toBeDefined();
    });

    it("should require response in responseData", async () => {
      const analysisWithoutResponse = { ...validAnalysisData };
      delete analysisWithoutResponse.responseData.response;

      const analysis = new MedicalAnalysis(analysisWithoutResponse);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["responseData.response"]).toBeDefined();
    });

    it("should require usage in responseData", async () => {
      const analysisWithoutUsage = { ...validAnalysisData };
      delete analysisWithoutUsage.responseData.usage;

      const analysis = new MedicalAnalysis(analysisWithoutUsage);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["responseData.usage.prompt_tokens"]).toBeDefined();
      expect(err.errors["responseData.usage.completion_tokens"]).toBeDefined();
      expect(err.errors["responseData.usage.total_tokens"]).toBeDefined();
    });
  });

  describe("Enum Validation", () => {
    it("should accept Male for sexe", async () => {
      const analysisWithMale = createValidCopy();
      analysisWithMale.requestData.sexe = "Male";

      const analysis = new MedicalAnalysis(analysisWithMale);
      const savedAnalysis = await analysis.save();

      expect(savedAnalysis.requestData.sexe).toBe("Male");
    });

    it("should accept Female for sexe", async () => {
      const analysisWithFemale = createValidCopy();
      analysisWithFemale.requestData.sexe = "Female";

      const analysis = new MedicalAnalysis(analysisWithFemale);
      const savedAnalysis = await analysis.save();

      expect(savedAnalysis.requestData.sexe).toBe("Female");
    });

    it("should reject invalid sexe value", async () => {
      const analysisWithInvalidSexe = createValidCopy();
      analysisWithInvalidSexe.requestData.sexe = "Other";

      const analysis = new MedicalAnalysis(analysisWithInvalidSexe);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.sexe"]).toBeDefined();
    });
  });

  describe("Range Validation", () => {
    it("should accept niveauDouleur between 1 and 10", async () => {
      const analysisWithValidNiveau = createValidCopy();
      analysisWithValidNiveau.requestData.niveauDouleur = 5;

      const analysis = new MedicalAnalysis(analysisWithValidNiveau);
      const savedAnalysis = await analysis.save();

      expect(savedAnalysis.requestData.niveauDouleur).toBe(5);
    });

    it("should reject niveauDouleur below 1", async () => {
      const analysisWithLowNiveau = createValidCopy();
      analysisWithLowNiveau.requestData.niveauDouleur = 0;

      const analysis = new MedicalAnalysis(analysisWithLowNiveau);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.niveauDouleur"]).toBeDefined();
    });

    it("should reject niveauDouleur above 10", async () => {
      const analysisWithHighNiveau = createValidCopy();
      analysisWithHighNiveau.requestData.niveauDouleur = 11;

      const analysis = new MedicalAnalysis(analysisWithHighNiveau);
      let err;

      try {
        await analysis.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors["requestData.niveauDouleur"]).toBeDefined();
    });
  });

  describe("Timestamps", () => {
    it("should have createdAt and updatedAt timestamps", async () => {
      const analysis = new MedicalAnalysis(createValidCopy());
      const savedAnalysis = await analysis.save();

      expect(savedAnalysis.createdAt).toBeDefined();
      expect(savedAnalysis.updatedAt).toBeDefined();
      expect(savedAnalysis.createdAt).toBeInstanceOf(Date);
      expect(savedAnalysis.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt when document is modified", async () => {
      const analysis = new MedicalAnalysis(createValidCopy());
      const savedAnalysis = await analysis.save();
      const originalUpdatedAt = savedAnalysis.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      savedAnalysis.requestData.niveauDouleur = 8;
      const updatedAnalysis = await savedAnalysis.save();

      expect(updatedAnalysis.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe("Indexes", () => {
    it("should have index on userId", async () => {
      const indexes = await MedicalAnalysis.collection.indexes();
      const userIdIndex = indexes.find(
        (index) => index.key && Object.keys(index.key).includes("userId")
      );

      expect(userIdIndex).toBeDefined();
    });

    it("should have compound index on userId and createdAt", async () => {
      const indexes = await MedicalAnalysis.collection.indexes();
      const compoundIndex = indexes.find(
        (index) =>
          index.key &&
          Object.keys(index.key).includes("userId") &&
          Object.keys(index.key).includes("createdAt")
      );

      expect(compoundIndex).toBeDefined();
    });
  });
});
