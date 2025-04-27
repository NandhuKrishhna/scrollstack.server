import { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { clearAuthCookies, REFRESH_PATH } from "../utils/setAuthCookies";
import AppError from "../utils/AppError";

// Function to handle Zod validation errors
const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(BAD_REQUEST).json({
    status: "fail",
    message: "Validation error",
    errors,
    timestamp: new Date().toISOString(),
  });
};

// Function to handle custom application errors (AppError)
const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    status: "error",
    message: error.message,
    errorCode: error.errorCode,
    timestamp: new Date().toISOString(),
  });
};

// Error handler middleware
const errorHandler: ErrorRequestHandler = (error, req: Request, res: Response, next: NextFunction) => {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    headers: req.headers,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    },
  };

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }


  if (error instanceof z.ZodError) {
    handleZodError(res, error);
    return;
  }

  if (error instanceof AppError) {
    handleAppError(res, error);
    return;
  }


  res.status(INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
    timestamp: new Date().toISOString(),
  });

  return;
};

export default errorHandler;
