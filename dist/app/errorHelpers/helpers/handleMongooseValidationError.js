"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongooseValidationError = void 0;
const handleMongooseValidationError = (error) => {
    const errorSources = [];
    const errors = Object.values(error.errors);
    errors.forEach((errorObj) => errorSources.push({
        path: errorObj.path,
        message: errorObj.message,
    }));
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};
exports.handleMongooseValidationError = handleMongooseValidationError;
