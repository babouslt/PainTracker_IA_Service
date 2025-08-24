import {
  replaceTemplateVariables,
  validateTemplateData,
  getTemplateById,
  getAllTemplates,
  promptTemplates,
  PromptData,
  PromptTemplate,
} from "../../utils/promptTemplates";

describe("PromptTemplates Utils", () => {
  describe("replaceTemplateVariables", () => {
    it("should replace all variables in template", () => {
      const template =
        "Hello {{name}}, you are {{age}} years old and live in {{city}}";
      const data: PromptData = {
        name: "John",
        age: 30,
        city: "Paris",
      };

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe("Hello John, you are 30 years old and live in Paris");
    });

    it("should handle multiple occurrences of the same variable", () => {
      const template = "{{name}} likes {{food}} and {{name}} hates {{drink}}";
      const data: PromptData = {
        name: "Alice",
        food: "pizza",
        drink: "coffee",
      };

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe("Alice likes pizza and Alice hates coffee");
    });

    it("should handle numeric values", () => {
      const template =
        "Age: {{age}}, Height: {{height}}cm, Weight: {{weight}}kg";
      const data: PromptData = {
        age: 25,
        height: 175,
        weight: 70.5,
      };

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe("Age: 25, Height: 175cm, Weight: 70.5kg");
    });

    it("should handle boolean values", () => {
      const template = "Is active: {{isActive}}, Is premium: {{isPremium}}";
      const data: PromptData = {
        isActive: true,
        isPremium: false,
      };

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe("Is active: true, Is premium: false");
    });

    it("should return template unchanged when no variables present", () => {
      const template = "This is a simple text without variables";
      const data: PromptData = {};

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe(template);
    });

    it("should handle empty data object", () => {
      const template = "Hello {{name}}!";
      const data: PromptData = {};

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe("Hello {{name}}!");
    });

    it("should handle undefined values", () => {
      const template = "Name: {{name}}, Age: {{age}}";
      const data: PromptData = {
        name: undefined as any,
        age: 25,
      };

      const result = replaceTemplateVariables(template, data);

      expect(result).toBe("Name: undefined, Age: 25");
    });
  });

  describe("validateTemplateData", () => {
    const mockTemplate: PromptTemplate = {
      id: "test_template",
      name: "Test Template",
      template: "Test template with {{field1}} and {{field2}}",
      description: "A test template",
      requiredFields: ["field1", "field2", "field3"],
      example: {
        field1: "value1",
        field2: "value2",
        field3: "value3",
      },
    };

    it("should return valid when all required fields are present", () => {
      const data: PromptData = {
        field1: "value1",
        field2: "value2",
        field3: "value3",
      };

      const result = validateTemplateData(mockTemplate, data);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    it("should return invalid when required fields are missing", () => {
      const data: PromptData = {
        field1: "value1",
        // field2 and field3 are missing
      };

      const result = validateTemplateData(mockTemplate, data);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["field2", "field3"]);
    });

    it("should return invalid when required fields are empty strings", () => {
      const data: PromptData = {
        field1: "value1",
        field2: "",
        field3: "   ", // whitespace only
      };

      const result = validateTemplateData(mockTemplate, data);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["field2", "field3"]);
    });

    it("should return invalid when required fields are null or undefined", () => {
      const data: PromptData = {
        field1: "value1",
        field2: null as any,
        field3: undefined as any,
      };

      const result = validateTemplateData(mockTemplate, data);

      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(["field2", "field3"]);
    });

    it("should handle numeric zero as valid", () => {
      const data: PromptData = {
        field1: 0,
        field2: "value2",
        field3: "value3",
      };

      const result = validateTemplateData(mockTemplate, data);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    it("should handle boolean false as valid", () => {
      const data: PromptData = {
        field1: "value1",
        field2: false,
        field3: "value3",
      };

      const result = validateTemplateData(mockTemplate, data);

      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe("getTemplateById", () => {
    it("should return template when ID exists", () => {
      const template = getTemplateById("medical_analysis");

      expect(template).toBeDefined();
      expect(template?.id).toBe("medical_analysis");
      expect(template?.name).toBe("Preliminary Medical Analysis");
    });

    it("should return undefined when ID does not exist", () => {
      const template = getTemplateById("non_existent_template");

      expect(template).toBeUndefined();
    });

    it("should return undefined when ID is empty string", () => {
      const template = getTemplateById("");

      expect(template).toBeUndefined();
    });
  });

  describe("getAllTemplates", () => {
    it("should return all available templates", () => {
      const templates = getAllTemplates();

      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it("should return the same array as promptTemplates", () => {
      const templates = getAllTemplates();

      expect(templates).toBe(promptTemplates);
    });
  });

  describe("promptTemplates collection", () => {
    it("should have at least one template", () => {
      expect(promptTemplates.length).toBeGreaterThan(0);
    });

    it("should have medical_analysis template with correct structure", () => {
      const medicalTemplate = promptTemplates.find(
        (t) => t.id === "medical_analysis"
      );

      expect(medicalTemplate).toBeDefined();
      expect(medicalTemplate?.name).toBe("Preliminary Medical Analysis");
      expect(medicalTemplate?.description).toBe(
        "Preliminary medical analysis based on an image and symptoms"
      );
      expect(Array.isArray(medicalTemplate?.requiredFields)).toBe(true);
      expect(medicalTemplate?.requiredFields).toContain("age");
      expect(medicalTemplate?.requiredFields).toContain("sexe");
      expect(medicalTemplate?.requiredFields).toContain("taille");
      expect(medicalTemplate?.requiredFields).toContain("poids");
      expect(medicalTemplate?.requiredFields).toContain("zoneCorps");
      expect(medicalTemplate?.requiredFields).toContain("symptomes");
      expect(medicalTemplate?.requiredFields).toContain("niveauDouleur");
      expect(medicalTemplate?.example).toBeDefined();
      expect(medicalTemplate?.template).toContain("{{age}}");
      expect(medicalTemplate?.template).toContain("{{sexe}}");
    });

    it("should have unique IDs for all templates", () => {
      const ids = promptTemplates.map((t) => t.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it("should have valid template structure for all templates", () => {
      promptTemplates.forEach((template) => {
        expect(template.id).toBeDefined();
        expect(template.name).toBeDefined();
        expect(template.template).toBeDefined();
        expect(template.description).toBeDefined();
        expect(Array.isArray(template.requiredFields)).toBe(true);
        expect(template.example).toBeDefined();
      });
    });
  });
});
