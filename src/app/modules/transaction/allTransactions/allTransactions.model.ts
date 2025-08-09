import { Schema, model } from "mongoose";
import {
  IAllTransactionHistory,
  TTransactionStatus,
} from "./allTransactions.interface";
import { UserRole } from "../../user/user.interface";

const AllTransactionHistorySchema = new Schema<IAllTransactionHistory>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["USER", "AGENT", "ADMIN"] as UserRole[],
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ["USER", "AGENT", "ADMIN"] as UserRole[],
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["CASH-IN", "SEND-MONEY", "CASHOUT"] as TTransactionStatus[],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    sender_phone: {
      type: String,
      required: true,
    },
    receiver_phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const AllTransactions = model<IAllTransactionHistory>(
  "AllTransactions",
  AllTransactionHistorySchema
);
