import { Types } from "mongoose";

export type UserRole = "USER" | "AGENT" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  wallet?: Types.ObjectId;
}
