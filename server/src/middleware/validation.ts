import { NextFunction, Request, Response } from "express";
import { validationResult, body, query } from "express-validator";
import { respondWith } from "utils/responseHandling";

export const MAX_FIELD_LENGTH = 255;

export const checkHas = (
  isBody: boolean,
  fieldName: string,
  isNumber: boolean
) => {
  if (isNumber) {
    return (isBody ? body(fieldName) : query(fieldName))
      .trim()
      .notEmpty()
      .withMessage(`${fieldName} is required`)
      .isLength({ max: MAX_FIELD_LENGTH })
      .withMessage(`${fieldName} is too long`)
      .isNumeric()
      .withMessage(`${fieldName} is invalid`);
  }

  return (isBody ? body(fieldName) : query(fieldName))
    .trim()
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isLength({ max: MAX_FIELD_LENGTH })
    .withMessage(`${fieldName} is too long`);
};

export const bodyHas = (fieldName: string, { isNumber = false } = {}) =>
  checkHas(true, fieldName, isNumber);

export const queryHas = (fieldName: string, { isNumber = false } = {}) =>
  checkHas(false, fieldName, isNumber);

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vResult = validationResult(req);

  // We only need to show one error at a time, so let's show the first one
  if (!vResult.isEmpty()) {
    const errorMessage = vResult.array()[0].msg;
    return respondWith({ res, status: 422, errorMessage });
  }

  next();
};
