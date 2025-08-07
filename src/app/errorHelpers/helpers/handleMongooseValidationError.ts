/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../errorInterfaces/error.type";

export const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  const errors = Object.values(error.errors);

  errors.forEach((errorObj: any) =>
    errorSources.push({
      path: errorObj.path,
      message: errorObj.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
