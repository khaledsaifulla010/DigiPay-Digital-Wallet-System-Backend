import { z } from "zod";

export const createUserZodSchema = z.object({
  // Name
  name: z
    .string()
    .min(2, { message: "Name too short. Minimum 2 characters long!" })
    .max(50, { message: "Name too long!" }),

  // Email
  email: z
    .email({ message: "Invalid email address format!" })
    .min(5, { message: "Email must be at least 5 characters long!" })
    .max(50, { message: "Email cannot exceed 50 characters!" }),

  // Password
  password: z
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
  role: z.enum(["USER", "AGENT", "ADMIN"]).optional(),
});
