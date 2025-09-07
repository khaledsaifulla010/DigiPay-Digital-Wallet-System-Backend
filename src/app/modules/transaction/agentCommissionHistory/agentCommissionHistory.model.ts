import { Schema, model } from "mongoose";
import { IAgentCommissionHistory } from "./agentCommissionHistory.interface";

const AgentCommissionHistorySchema = new Schema<IAgentCommissionHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["CASH-IN", "CASHOUT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
    },
    receiverPhone: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);
AgentCommissionHistorySchema.index({ userId: 1, createdAt: -1 });
export const AgentCommissionHistory = model<IAgentCommissionHistory>(
  "AgentCommissionHistory",
  AgentCommissionHistorySchema
);
