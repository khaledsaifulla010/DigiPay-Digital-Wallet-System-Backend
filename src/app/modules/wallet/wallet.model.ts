import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.interface";
import { UserRole, UserStatus } from "../user/user.interface";

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["USER", "AGENT", "ADMIN"] as UserRole[],
      required: true,
    },
    userStatus: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"] as UserStatus[],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 50,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
