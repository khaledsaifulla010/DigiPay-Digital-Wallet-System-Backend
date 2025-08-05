import { Schema, model } from "mongoose";
import { IUserTransactionHistory } from "./userTransactionHistory.interface";

const userTransactionHistorySchema = new Schema<IUserTransactionHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["TOP-UP", "SEND-MONEY", "WITHDRAW"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

export const UserTransaction = model<IUserTransactionHistory>(
  "UserTransaction",
  userTransactionHistorySchema
);
