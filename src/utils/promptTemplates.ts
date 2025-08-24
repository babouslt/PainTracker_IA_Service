// Types for prompt templates
export interface PromptData {
  [key: string]: string | number | boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  description: string;
  requiredFields: string[];
  example: PromptData;
}

// Collection of prompt templates
export const promptTemplates: PromptTemplate[] = [
  {
    id: "medical_analysis",
    name: "Preliminary Medical Analysis",
    template: `You are a medical assistant specialized in preliminary symptom analysis. You will analyze an image of the human body with a highlighted area and patient information.

IMPORTANT: This is a preliminary analysis only. You cannot make a definitive diagnosis. You must always recommend consulting a healthcare professional.

PATIENT INFORMATION:
- Age: {{age}} years
- Gender: {{sexe}}
- Height: {{taille}} cm
- Weight: {{poids}} kg

AFFECTED AREA: {{zoneCorps}}
SYMPTOM DESCRIPTION: {{symptomes}}
PAIN LEVEL (1-10): {{niveauDouleur}}

ANALYSIS TO PROVIDE:

1. **Possible diagnostic hypotheses** (2-3 most likely causes)
   - For each hypothesis: brief explanation, risk factors, typical symptoms

2. **Identification tests**
   - How can the patient verify if this is indeed the problem?
   - Signs to monitor
   - Simple tests to do at home

3. **Temporary relief advice**
   - Non-medicinal methods (rest, ice, heat, etc.)
   - Positions to avoid/adopt
   - Activities to limit

4. **Warning signs** (when to consult immediately)
   - Symptoms that require urgent consultation
   - Evolution to monitor

5. **Final recommendation**
   - Type of professional to consult
   - Recommended timeframe for consultation

RESPONSE FORMAT:
- Clear structure with numbering
- Accessible language for the patient
- Always start with "This is a preliminary analysis only"
- Always end with a consultation recommendation`,
    description: "Preliminary medical analysis based on an image and symptoms",
    requiredFields: [
      "age",
      "sexe",
      "taille",
      "poids",
      "zoneCorps",
      "symptomes",
      "niveauDouleur",
    ],
    example: {
      age: "35",
      sexe: "Female",
      taille: "165",
      poids: "60",
      zoneCorps: "Right shoulder",
      symptomes:
        "Sharp pain when rotating the arm, difficulty raising the arm above the head, pain radiating to the neck",
      niveauDouleur: "7",
    },
  },
];

// Function to replace variables in a template
export function replaceTemplateVariables(
  template: string,
  data: PromptData
): string {
  let result = template;

  // Replace all variables {{variable}}
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, "g"), String(value));
  }

  return result;
}

// Function to validate required data
export function validateTemplateData(
  template: PromptTemplate,
  data: PromptData
): { isValid: boolean; missingFields: string[] } {
  const missingFields = template.requiredFields.filter((field) => {
    const value = data[field];
    // Check if value exists and is not an empty string (after trimming)
    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    );
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Function to get a template by ID
export function getTemplateById(id: string): PromptTemplate | undefined {
  return promptTemplates.find((template) => template.id === id);
}

// Function to list all templates
export function getAllTemplates(): PromptTemplate[] {
  return promptTemplates;
}
