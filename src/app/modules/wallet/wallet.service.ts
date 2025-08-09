import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError/AppError";
import { AgentCommissionHistory } from "../transaction/agentCommissionHistory/agentCommissionHistory.model";
import { AllTransactions } from "../transaction/allTransactions/allTransactions.model";
import { UserTransaction } from "../transaction/userTransactionHistory/userTransactionHistory.model";
import { User } from "../user/user.model";
import { ITransferRequest } from "./transfer/transfer.interface";
import { Wallet } from "./wallet.model";
import httpStatus from "http-status-codes";
import { IWallet } from "./wallet.interface";
import { UserRole } from "../user/user.interface";
import { Types } from "mongoose";

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
  if (receiver.role === "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot send money to an admin number."
    );
  }
  if (sender.status === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );
  }

  const senderWallet = await Wallet.findOne({ userId: sender._id });
  const receiverWallet = await Wallet.findOne({ userId: receiver._id });

  if (!senderWallet || !receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  if (senderWallet.userStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );
  }
  if (senderWallet.walletStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Wallet is Blocked. Please Contact With Your Admin."
    );
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
  await AllTransactions.create({
    senderId: sender._id,
    senderName: sender.name,
    senderRole: sender.role,
    receiverId: receiver._id,
    receiverName: receiver.name,
    receiverRole: receiver.role,
    transactionType: "SEND-MONEY",
    amount: amount,
    sender_phone: sender.phone,
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
  if (receiver.role === "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cashout money to an admin number."
    );
  }
  if (sender.status === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );
  }

  const senderWallet = await Wallet.findOne({ userId: sender._id });
  const receiverWallet = await Wallet.findOne({ userId: receiver._id });

  if (!senderWallet || !receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  if (senderWallet.userStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );
  }
  if (senderWallet.walletStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Wallet is Blocked. Please Contact With Your Admin."
    );
  }
  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  const commission = Number(((amount * 4) / 1000).toFixed(2));
  senderWallet.balance -= commission;
  receiverWallet.balance += commission;

  await senderWallet.save();
  await receiverWallet.save();

  await UserTransaction.create({
    userId: sender._id,
    userName: sender.name,
    type: "CASHOUT",
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

  await AllTransactions.create({
    senderId: sender._id,
    senderName: sender.name,
    senderRole: sender.role,
    receiverId: receiver._id,
    receiverName: receiver.name,
    receiverRole: receiver.role,
    transactionType: "CASHOUT",
    amount: amount,
    sender_phone: sender.phone,
    receiver_phone: receiver.phone,
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
  if (receiver.role === "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cash in money to an admin number."
    );
  }
  if (sender.status === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );
  }

  const senderWallet = await Wallet.findOne({ userId: sender._id });
  const receiverWallet = await Wallet.findOne({ userId: receiver._id });

  if (!senderWallet || !receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }
  if (senderWallet.userStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );
  }
  if (senderWallet.walletStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Wallet is Blocked. Please Contact With Your Admin."
    );
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  const commission = Number(((amount * 4) / 1000).toFixed(2));
  senderWallet.balance += commission;

  await senderWallet.save();
  await receiverWallet.save();

  await UserTransaction.create({
    userId: sender._id,
    userName: sender.name,
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

  await AllTransactions.create({
    senderId: sender._id,
    senderName: sender.name,
    senderRole: sender.role,
    receiverId: receiver._id,
    receiverName: receiver.name,
    receiverRole: receiver.role,
    transactionType: "CASH-IN",
    amount: amount,
    sender_phone: sender.phone,
    receiver_phone: receiver.phone,
  });

  return {
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
    commissionAmount: commission,
  };
};

// ADMIN ROLE //
// GET ALL WALLETS //
export const getAllWallets = async () => {
  return Wallet.find();
};

// UPDATE A USER WALLET STATUS //
const updateUserWallet = async (
  userId: string,
  payload: Partial<IWallet>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role !== UserRole.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only ADMIN can update wallet status.",
      ""
    );
  }

  const wallet = await Wallet.findOne({ userId: new Types.ObjectId(userId) });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found!", "");
  }

  const allowedUpdate: Partial<IWallet> = {};
  if (payload.walletStatus) {
    allowedUpdate.walletStatus = payload.walletStatus;
  }
  if (!allowedUpdate.walletStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "As an ADMIN you can update only user wallet status.",
      ""
    );
  }

  const updatedWallet = await Wallet.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    allowedUpdate,
    { new: true, runValidators: true }
  );

  return updatedWallet;
};

// Get A Wallet //
export const getWalletById = async (id: string) => {
  return Wallet.findById(id);
};

export const WalletServices = {
  withdrawBalance,
  transferMoney,
  cashInMoney,
  getAllWallets,
  getWalletById,
  updateUserWallet,
};
