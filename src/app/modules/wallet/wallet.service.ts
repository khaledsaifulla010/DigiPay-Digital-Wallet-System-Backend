import AppError from "../../errorHelpers/appError/AppError";
import { AgentCommissionHistory } from "../transaction/agentCommissionHistory/agentCommissionHistory.model";
import { UserTransaction } from "../transaction/userTransactionHistory/userTransactionHistory.model";
import { User } from "../user/user.model";
import { ITransferRequest } from "./transfer/transfer.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";

// USER ROLE //
// Send money to another user
export const transferMoney = async ({
  senderPhone,
  receiverPhone,
  amount,
}: ITransferRequest) => {
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
    userName: sender.name,
    type: "SEND-MONEY",
    amount: amount,
    receiver_phone: receiver.phone,
  });

  return {
    name: sender.name,
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
  };
};

// Withdraw money (Cashout)
export const withdrawBalance = async ({
  senderPhone,
  receiverPhone,
  amount,
}: {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
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

  const commission = Number(((amount * 4) / 100).toFixed(2));
  senderWallet.balance -= commission;
  receiverWallet.balance += commission;

  await senderWallet.save();
  await receiverWallet.save();

  await UserTransaction.create({
    userId: sender._id,
    type: "CASHOUT",
    userName: sender.name,
    amount: amount,
    receiver_phone: receiver.phone,
  });

  await AgentCommissionHistory.create({
    userId: receiver._id,
    type: "CASHOUT",
    amount: amount,
    commission: commission,
    reference: receiver.phone,
  });

  return {
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
  };
};

// AGENT ROLE //

// Add money to any user's wallet (cash-in)
export const cashInMoney = async ({
  senderPhone,
  receiverPhone,
  amount,
}: {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
}) => {
  if (senderPhone === receiverPhone) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot cash in to yourself");
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
      "Cannot cash in money to an agent number."
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

  const commission = Number(((amount * 4) / 100).toFixed(2));
  senderWallet.balance += commission;

  await senderWallet.save();
  await receiverWallet.save();

  await UserTransaction.create({
    userId: receiver._id,
    amount: amount,
    type: "CASH-IN",
    reference: sender.phone,
  });

  await AgentCommissionHistory.create({
    userId: sender._id,
    type: "CASH-IN",
    amount: amount,
    commission: commission,
    reference: receiver.phone,
  });

  return {
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
    commissionAmount: commission,
  };
};

export const WalletServices = {
  withdrawBalance,
  transferMoney,
  cashInMoney,
};
