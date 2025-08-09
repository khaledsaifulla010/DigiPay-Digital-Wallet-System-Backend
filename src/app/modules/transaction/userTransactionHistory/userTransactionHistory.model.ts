import { Schema, model } from "mongoose";
import { IUserTransactionHistory } from "./userTransactionHistory.interface";

const userTransactionHistorySchema = new Schema<IUserTransactionHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["CASH-IN", "SEND-MONEY", "CASHOUT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    receiver_phone: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export const UserTransaction = model<IUserTransactionHistory>(
  "UserTransaction",
  userTransactionHistorySchema
);
