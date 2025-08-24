import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

// Validator for medical data
export const validateMedicalData: ValidationChain[] = [
  body("userId").notEmpty().isString().withMessage("User ID is required"),
  body("age")
    .notEmpty()
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be a number between 1 and 120"),
  body("sexe")
    .notEmpty()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be 'Male' or 'Female'"),
  body("taille")
    .notEmpty()
    .isInt({ min: 50, max: 250 })
    .withMessage("Height must be a number between 50 and 250 cm"),
  body("poids")
    .notEmpty()
    .isFloat({ min: 1, max: 300 })
    .withMessage("Weight must be a number between 1 and 300 kg"),
  body("symptomes")
    .notEmpty()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Symptoms must contain between 10 and 1000 characters"),
  body("niveauDouleur")
    .notEmpty()
    .isInt({ min: 1, max: 10 })
    .withMessage("Pain level must be a number between 1 and 10"),
];

export const validation = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      status: 400,
      stack: process.env.NODE_ENV,
      errors: errors.array(),
    });
  }

  next();
};
