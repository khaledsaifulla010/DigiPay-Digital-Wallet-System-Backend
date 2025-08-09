import { Types } from "mongoose";
import { AgentCommissionHistory } from "./agentCommissionHistory.model";

export const getAgentTransactions = async (userId: string | Types.ObjectId) => {
  const objectUserId =
    typeof userId === "string" ? new Types.ObjectId(userId) : userId;

  const transactions = await AgentCommissionHistory.find({
    userId: objectUserId,
  }).sort({
    createdAt: -1,
  });

  return transactions;
};

export const AgentCommissionHistoryServices = {
  getAgentTransactions,
};
