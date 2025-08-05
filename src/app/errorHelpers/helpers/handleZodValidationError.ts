/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../errorInterfaces/error.type";

export const handleZodValidationError = (error: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  error.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod Validation Error!",
    errorSources,
  };
};
