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


// export const createUserTransaction = async ({
//   userId,
//   type,
//   amount,
//   reference,
// }: {
//   userId: string;
//   type: "TOP-UP" | "SEND-MONEY" | "WITHDRAW";
//   amount: number;
//   reference?: string;
// }) => {
//   const transaction = await UserTransaction.create({
//     userId,
//     type,
//     amount,
//     reference,
//   });

//   return transaction;
// };
