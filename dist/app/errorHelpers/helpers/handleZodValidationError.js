"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodValidationError = void 0;
const handleZodValidationError = (error) => {
    const errorSources = [];
    error.issues.forEach((issue) => {
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
exports.handleZodValidationError = handleZodValidationError;
