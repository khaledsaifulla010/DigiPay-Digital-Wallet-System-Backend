"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    // Name
    name: zod_1.z
        .string()
        .min(2, { message: "Name too short. Minimum 2 characters long!" })
        .max(50, { message: "Name too long!" }),
    // Email
    email: zod_1.z
        .email({ message: "Invalid email address format!" })
        .min(5, { message: "Email must be at least 5 characters long!" })
        .max(50, { message: "Email cannot exceed 50 characters!" }),
    // Phone
    phone: zod_1.z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    // Password
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain atleast 1 uppercase letter!",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain atleast 1 special character!",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain atleast 1 number!",
    }),
    // Role
    role: zod_1.z.enum(["USER", "AGENT", "ADMIN"]).optional(),
});
