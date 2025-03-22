import { Response } from "express";

export const SUCCESS_MESSAGE = "success";

// Return a consistent set of JSON for all endpoints:
// Successful response: { data: {...}. error: null }
// Error response: { data: null, error: "Error message" }
export const respondWith = ({
  res,
  status,
  data,
  errorMessage,
}: {
  res: Response;
  status: number;
  data?: any;
  errorMessage?: string;
}) => {
  const error = errorMessage ?? null;
  const returnedData = data ?? null;
  const response = { data: returnedData, error };

  res.status(status).json(response);
};
