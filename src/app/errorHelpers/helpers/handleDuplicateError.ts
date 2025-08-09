/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../errorInterfaces/error.type";

export const handleDuplicateError = (error: any): TGenericErrorResponse => {
  // Use Mongoose's keyValue when available
  if (error?.keyValue) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return {
      statusCode: 400,
      message: `${field} "${value}" already exist!`,
    };
  }

  // Fallback to regex match safely
  const matchedArray = error?.message?.match(/"([^"]*)"/);
  const value = matchedArray && matchedArray[1] ? matchedArray[1] : "Field";

  return {
    statusCode: 400,
    message: `${value} already exist!`,
  };
};
