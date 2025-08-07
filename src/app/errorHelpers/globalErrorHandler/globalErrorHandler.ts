/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import { TErrorSources } from "../errorInterfaces/error.type";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleMongooseValidationError } from "../helpers/handleMongooseValidationError";
import { handleZodValidationError } from "../helpers/handleZodValidationError";
import AppError from "../appError/AppError";

export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something Went Wrong!";
  let errorSources: TErrorSources[] = [];

  // Mongoose Duplicate Error
  if (error.code === 11000) {
    const simplifiedDuplicateError = handleDuplicateError(error);
    statusCode = simplifiedDuplicateError.statusCode;
    message = simplifiedDuplicateError.message;
  }
  // Mongoose Cast Error (Object ID)
  else if (error.name === "CastError") {
    const simplifiedCastError = handleCastError(error);
    statusCode = simplifiedCastError.statusCode;
    message = simplifiedCastError.message;
  }

  // Mongoose Validation Error
  else if (error.name === "ValidationError") {
    const simplifiedMongooseValidationError =
      handleMongooseValidationError(error);
    statusCode = simplifiedMongooseValidationError.statusCode;
    message = simplifiedMongooseValidationError.message;
    errorSources =
      simplifiedMongooseValidationError.errorSources as TErrorSources[];
  }

  // ZOD Validation Error
  else if (error.name === "ZodError") {
    const simplifiedZodValidationError = handleZodValidationError(error);
    statusCode = simplifiedZodValidationError.statusCode;
    message = simplifiedZodValidationError.message;
    errorSources = simplifiedZodValidationError.errorSources as TErrorSources[];
  }

  // Others Errors
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null,
  });
};
