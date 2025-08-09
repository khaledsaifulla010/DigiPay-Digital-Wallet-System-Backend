import { Types } from "mongoose";

export type TTransactionStatus = "CASH-IN" | "SEND-MONEY" | "CASHOUT";

export interface IAllTransactionHistory {
  _id?: string;
  senderId: Types.ObjectId | string;
  senderName: string;
  senderRole: string;
  receiverId: Types.ObjectId | string;
  receiverName: string;
  receiverRole: string;
  transactionType: TTransactionStatus;
  amount: number;
  sender_phone: string;
  receiver_phone: string;
}
