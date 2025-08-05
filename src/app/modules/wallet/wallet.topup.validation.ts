import * as z from "zod";

export const TopUpValidation = z.object({
  phone: z.string().min(10, "Phone number is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});
