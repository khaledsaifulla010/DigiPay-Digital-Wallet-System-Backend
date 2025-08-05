import AppError from "../../errorHelpers/appError/AppError";
import { User } from "../user/user.model";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";

// Add money (top-up)
export const topUpWallet = async (phone: string, amount: number) => {
  const user = await User.findOne({ phone });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const wallet = await Wallet.findById(user.wallet);
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (wallet.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is blocked");
  }

  wallet.balance += amount;
  await wallet.save();

  return {
    balance: wallet.balance,
  };
};

// Withdraw money
export const withdrawBalance = async ({
  phone,
  amount,
}: {
  phone: string;
  amount: number;
}) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const wallet = await Wallet.findOne({ owner: user._id });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (wallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  return {
    balance: wallet.balance,
  };
};

export const WalletServices = {
  topUpWallet,
  withdrawBalance,
};
