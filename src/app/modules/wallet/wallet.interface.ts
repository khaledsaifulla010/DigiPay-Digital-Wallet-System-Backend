import { Types } from "mongoose";
import { IUser, UserRole, UserStatus } from "../user/user.interface";

export enum wallletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  _id?: string;
  userId: Types.ObjectId | IUser;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: UserRole;
  userStatus: UserStatus;
  walletStatus: wallletStatus;
  balance: number;
}
