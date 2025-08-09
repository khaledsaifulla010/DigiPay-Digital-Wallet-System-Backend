import { Types } from "mongoose";

export type TTransactionStatus = "CASH-IN" | "SEND-MONEY" | "CASHOUT";

export interface IUserTransactionHistory {
  _id?: string;
  userName: string;
  userId: Types.ObjectId | string;
  type: TTransactionStatus;
  amount: number;
  receiver_phone?: string;
}
