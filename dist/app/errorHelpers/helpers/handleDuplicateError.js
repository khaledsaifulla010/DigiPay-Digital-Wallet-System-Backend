"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (error) => {
    var _a;
    // Use Mongoose's keyValue when available
    if (error === null || error === void 0 ? void 0 : error.keyValue) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        return {
            statusCode: 400,
            message: `${field} "${value}" already exist!`,
        };
    }
    // Fallback to regex match safely
    const matchedArray = (_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.match(/"([^"]*)"/);
    const value = matchedArray && matchedArray[1] ? matchedArray[1] : "Field";
    return {
        statusCode: 400,
        message: `${value} already exist!`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
