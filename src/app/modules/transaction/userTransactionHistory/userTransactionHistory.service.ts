import { Types } from "mongoose";
import { UserTransaction } from "./userTransactionHistory.model";

export const getUserTransactions = async (userId: string | Types.ObjectId) => {
  const objectUserId =
    typeof userId === "string" ? new Types.ObjectId(userId) : userId;

  const transactions = await UserTransaction.find({
    userId: objectUserId,
  }).sort({
    createdAt: -1,
  });

  return transactions;
};


export const UserTransactionHistoryServices = {
  getUserTransactions,
};