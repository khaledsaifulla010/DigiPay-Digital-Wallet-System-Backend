import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 50 },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
