import { Types } from "mongoose";
import { IUser, UserRole, UserStatus } from "../user/user.interface";

export interface IWallet {
  _id?: string;
  userId: Types.ObjectId | IUser;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: UserRole;
  userStatus: UserStatus;
  balance: number;
}
