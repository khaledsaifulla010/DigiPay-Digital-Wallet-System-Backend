"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.TransferValidationSchema = zod_1.default.object({
    senderPhone: zod_1.default.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    receiverPhone: zod_1.default.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    amount: zod_1.default.number().min(1, "Minimum transfer amount is 1"),
});
