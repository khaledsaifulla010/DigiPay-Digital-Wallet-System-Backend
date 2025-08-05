import z from "zod";
export const TransferValidationSchema = z.object({
  senderPhone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  }),
  receiverPhone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone Number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  }),
  amount: z.number().min(1, "Minimum transfer amount is 1"),
});
