import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface IWallet {
  _id?: string;
  owner: Types.ObjectId | IUser;
  balance: number;
  status?: "ACTIVE" | "BLOCKED";
}
