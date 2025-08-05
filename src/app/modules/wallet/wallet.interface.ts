import { Types } from "mongoose";

export interface IWallet {
  _id?: string;
  owner: Types.ObjectId;
  balance: number;
  status?: "active" | "blocked";
}
