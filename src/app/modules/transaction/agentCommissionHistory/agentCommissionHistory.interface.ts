import { Types } from "mongoose";

export type TTransactionStatus = "CASH-IN" | "CASHOUT";

export interface IAgentCommissionHistory {
  _id?: string;
  userId: Types.ObjectId | string;
  type: TTransactionStatus;
  amount: number;
  commission: number;
  reference?: string;
  receiverPhone?: string;
  transactionId: string;
  timestamp?: Date;
}
