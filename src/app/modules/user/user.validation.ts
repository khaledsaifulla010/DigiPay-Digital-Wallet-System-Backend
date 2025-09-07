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

  // Phone
  phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  }),

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

export const updateMyProfileZodSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name too short." })
      .max(60, { message: "Name too long." })
      .optional(),
    phone: z
      .string()
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message:
          "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
      })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" })
      .regex(/(?=.*[A-Z])/, {
        message: "Password must contain atleast 1 uppercase letter!",
      })
      .regex(/(?=.*[!@#$%^&*])/, {
        message: "Password must contain atleast 1 special character!",
      })
      .regex(/(?=.*\d)/, { message: "Password must contain atleast 1 number!" })
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.phone !== undefined ||
      data.password !== undefined,
    {
      message: "At least one of name, phone, or password must be provided.",
    }
  );
