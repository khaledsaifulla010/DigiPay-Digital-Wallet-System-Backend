import { z } from "zod";

export const WithdrawValidationSchema = z.object({
  phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  }),
  amount: z.number().min(10, "Minimum withdraw amount is 10"),
});
