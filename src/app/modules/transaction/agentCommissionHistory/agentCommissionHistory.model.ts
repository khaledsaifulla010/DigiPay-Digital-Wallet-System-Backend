import { Schema, model } from "mongoose";
import { IAgentCommissionHistory } from "./agentCommissionHistory.interface";

const AgentCommissionHistoryHistorySchema = new Schema<IAgentCommissionHistory>(
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
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

export const AgentCommissionHistory = model<IAgentCommissionHistory>(
  "AgentCommissionHistory",
  AgentCommissionHistoryHistorySchema
);
