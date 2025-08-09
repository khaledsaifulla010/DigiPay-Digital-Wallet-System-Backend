"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../../config/env");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleCastError_1 = require("../helpers/handleCastError");
const handleMongooseValidationError_1 = require("../helpers/handleMongooseValidationError");
const handleZodValidationError_1 = require("../helpers/handleZodValidationError");
const AppError_1 = __importDefault(require("../appError/AppError"));
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = 500;
    let message = "Something Went Wrong!";
    let errorSources = [];
    // Mongoose Duplicate Error
    if (error.code === 11000) {
        const simplifiedDuplicateError = (0, handleDuplicateError_1.handleDuplicateError)(error);
        statusCode = simplifiedDuplicateError.statusCode;
        message = simplifiedDuplicateError.message;
    }
    // Mongoose Cast Error (Object ID)
    else if (error.name === "CastError") {
        const simplifiedCastError = (0, handleCastError_1.handleCastError)(error);
        statusCode = simplifiedCastError.statusCode;
        message = simplifiedCastError.message;
    }
    // Mongoose Validation Error
    else if (error.name === "ValidationError") {
        const simplifiedMongooseValidationError = (0, handleMongooseValidationError_1.handleMongooseValidationError)(error);
        statusCode = simplifiedMongooseValidationError.statusCode;
        message = simplifiedMongooseValidationError.message;
        errorSources =
            simplifiedMongooseValidationError.errorSources;
    }
    // ZOD Validation Error
    else if (error.name === "ZodError") {
        const simplifiedZodValidationError = (0, handleZodValidationError_1.handleZodValidationError)(error);
        statusCode = simplifiedZodValidationError.statusCode;
        message = simplifiedZodValidationError.message;
        errorSources = simplifiedZodValidationError.errorSources;
    }
    // Others Errors
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: env_1.envVars.NODE_ENV === "development" ? error : null,
        stack: env_1.envVars.NODE_ENV === "development" ? error.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
