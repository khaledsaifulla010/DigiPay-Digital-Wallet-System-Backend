import { Types } from "mongoose";

export type TTransactionStatus = "TOP-UP" | "SEND-MONEY" | "WITHDRAW";

export interface IUserTransactionHistory {
  _id?: string;
  userId: Types.ObjectId | string;
  type: TTransactionStatus;
  amount: number;
  reference?: string;
  timestamp?: Date;
}
