import { NextFunction, Request, Response } from "express";
import { respondWith } from "utils/responseHandling";

export const OOPS_MESSAGE =
  "Oops, something went wrong! Please contact Jason to get it fixed!";

// Placeholder middlware in case I need to handle more generic errors common to all
// endpoints. For now it just responds with a generic server error.
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  respondWith({
    res,
    status: 500,
    errorMessage: OOPS_MESSAGE,
  });
};
