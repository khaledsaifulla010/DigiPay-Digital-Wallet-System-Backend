import AppError from "../../errorHelpers/appError/AppError";
import { UserTransaction } from "../transaction/userTransactionHistory/userTransactionHistory.model";
import { User } from "../user/user.model";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";

// Withdraw money (Cashout)
export const withdrawBalance = async ({
  senderPhone,
  receiverPhone,
  amount,
}: {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
  role: string;
}) => {
  if (senderPhone === receiverPhone) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot cashout to yourself");
  }

  const sender = await User.findOne({ phone: senderPhone });
  const receiver = await User.findOne({ phone: receiverPhone });

  if (!sender) {
    throw new AppError(httpStatus.NOT_FOUND, "Your number not found");
  }

  if (!receiver) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent number not found");
  }

  if (receiver.role === "USER") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cashout money to an user number."
    );
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

  await UserTransaction.create({
    userId: sender._id,
    type: "CASHOUT",
    amount,
    reference: receiver.phone,
  });

  return {
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
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
  role: string;
}) => {
  if (senderPhone === receiverPhone) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot transfer to yourself");
  }

  const sender = await User.findOne({ phone: senderPhone });
  const receiver = await User.findOne({ phone: receiverPhone });


   if (!sender) {
     throw new AppError(httpStatus.NOT_FOUND, "Your number not found");
   }

   if (!receiver) {
     throw new AppError(httpStatus.NOT_FOUND, "Receiver number not found");
   }

  if (receiver.role === "AGENT") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot send money to an agent number."
    );
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

  await UserTransaction.create({
    userId: sender._id,
    type: "SEND-MONEY",
    amount,
    reference: receiver.phone,
  });

  return {
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
  };
};

export const WalletServices = {
  withdrawBalance,
  transferMoney,
};
