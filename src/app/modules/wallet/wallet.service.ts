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

// Send money to another user
export const transferMoney = async ({
  senderPhone,
  receiverPhone,
  amount,
}: {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
}) => {
  if (senderPhone === receiverPhone) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot transfer to yourself");
  }

  const sender = await User.findOne({ phone: senderPhone });
  const receiver = await User.findOne({ phone: receiverPhone });

  if (!sender || !receiver) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender or receiver not found");
  }

  const senderWallet = await Wallet.findOne({ owner: sender._id });
  const receiverWallet = await Wallet.findOne({ owner: receiver._id });

  if (!senderWallet || !receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  return {
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
  };
};

export const WalletServices = {
  topUpWallet,
  withdrawBalance,
  transferMoney,
};
