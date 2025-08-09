"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawValidationSchema = void 0;
const zod_1 = require("zod");
exports.WithdrawValidationSchema = zod_1.z.object({
    senderPhone: zod_1.z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    receiverPhone: zod_1.z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    amount: zod_1.z.number().min(1, "Minimum transfer amount is 10"),
});
