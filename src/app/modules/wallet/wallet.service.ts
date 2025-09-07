/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { generateTransactionId } from "../../utils/generateTransactionId";


const round2 = (n: number) => Number(n.toFixed(2));

const computeCashOutFees = (amount: number) => {
  const totalFee = round2((amount * 20) / 1000);
  const adminCommission = round2((amount * 15.5) / 1000);
  const agentCommission = round2((amount * 4.5) / 1000);
  return { totalFee, adminCommission, agentCommission };
};


const computeSendMoneyFees = (amount: number) => {
  const adminCommission = round2((amount * 10) / 1000);
  return { adminCommission };
};


const computeCashInCommission = (amount: number) => {
  const agentCommission = round2((amount * 4) / 1000);
  return { agentCommission };
};


const getAdminWallet = async () => {
  const admin = await User.findOne({ role: UserRole.ADMIN });
  if (!admin) throw new AppError(httpStatus.NOT_FOUND, "Admin user not found");
  const adminWallet = await Wallet.findOne({ userId: admin._id });
  if (!adminWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Admin wallet not found");
  return { admin, adminWallet };
};

// USER ROLE //
// Send money to another user (fee: 10/1000 goes to admin)
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

  if (!sender)
    throw new AppError(httpStatus.NOT_FOUND, "Your number not found");
  if (!receiver)
    throw new AppError(httpStatus.NOT_FOUND, "Receiver number not found");

  if (receiver.role === "AGENT")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot send money to an agent number."
    );
  if (receiver.role === "ADMIN")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot send money to an admin number."
    );
  if (sender.status === "BLOCKED")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );

  const senderWallet = await Wallet.findOne({ userId: sender._id });
  const receiverWallet = await Wallet.findOne({ userId: receiver._id });
  if (!senderWallet || !receiverWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  // --- Fees (Send Money) ---
  const { adminCommission } = computeSendMoneyFees(amount);
  const totalDebit = round2(amount + adminCommission);

  if (senderWallet.balance < totalDebit)
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

  if (
    senderWallet.userStatus === "BLOCKED" ||
    senderWallet.walletStatus === "BLOCKED"
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account/Wallet is Blocked. Please Contact With Your Admin."
    );

  // Credit Admin with adminCommission
  const { adminWallet } = await getAdminWallet();

  // Apply balances
  senderWallet.balance = round2(senderWallet.balance - totalDebit);
  receiverWallet.balance = round2(receiverWallet.balance + amount);
  adminWallet.balance = round2(adminWallet.balance + adminCommission);

  await senderWallet.save();
  await receiverWallet.save();
  await adminWallet.save();

  const transactionId = generateTransactionId();

  await UserTransaction.create({
    transactionId,
    userId: sender._id,
    userName: sender.name,
    type: "SEND-MONEY",
    amount,
    receiver_phone: receiver.phone,
  });

  // NOTE: per request, add adminCommission only on AllTransactions
  await AllTransactions.create({
    transactionId,
    senderId: sender._id,
    senderName: sender.name,
    senderRole: sender.role,
    receiverId: receiver._id,
    receiverName: receiver.name,
    receiverRole: receiver.role,
    transactionType: "SEND-MONEY",
    amount,
    adminCommission, 
    sender_phone: sender.phone,
    receiver_phone: receiver.phone,
  });

  return {
    transactionId,
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

  if (!sender)
    throw new AppError(httpStatus.NOT_FOUND, "Your number not found");
  if (!receiver)
    throw new AppError(httpStatus.NOT_FOUND, "Agent number not found");

  if (receiver.role === "USER")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cashout money to a user number."
    );
  if (receiver.role === "ADMIN")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cashout money to an admin number."
    );
  if (sender.status === "BLOCKED")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );

  const senderWallet = await Wallet.findOne({ userId: sender._id });
  const receiverWallet = await Wallet.findOne({ userId: receiver._id });
  if (!senderWallet || !receiverWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  if (
    senderWallet.userStatus === "BLOCKED" ||
    senderWallet.walletStatus === "BLOCKED"
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account/Wallet is Blocked. Please Contact With Your Admin."
    );

  // --- Fees (Cash-Out) ---
  const { totalFee, adminCommission, agentCommission } =
    computeCashOutFees(amount);
  const totalDebit = round2(amount + totalFee);

  if (senderWallet.balance < totalDebit)
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

  const { adminWallet } = await getAdminWallet();

  // Apply balances
  senderWallet.balance = round2(senderWallet.balance - totalDebit);
  // Agent receives the withdrawal amount + their commission
  receiverWallet.balance = round2(
    receiverWallet.balance + amount + agentCommission
  );
  // Admin receives his commission
  adminWallet.balance = round2(adminWallet.balance + adminCommission);

  await senderWallet.save();
  await receiverWallet.save();
  await adminWallet.save();

  const transactionId = generateTransactionId();

  await UserTransaction.create({
    transactionId,
    userId: sender._id,
    userName: sender.name,
    type: "CASHOUT",
    amount,
    receiver_phone: receiver.phone,
  });

  // log agent commission
  await AgentCommissionHistory.create({
    transactionId,
    userId: receiver._id,
    type: "CASHOUT",
    amount,
    commission: agentCommission,
    reference: receiver.phone,
    receiverPhone: sender.phone,
  });

  await AllTransactions.create({
    transactionId,
    senderId: sender._id,
    senderName: sender.name,
    senderRole: sender.role,
    receiverId: receiver._id,
    receiverName: receiver.name,
    receiverRole: receiver.role,
    transactionType: "CASHOUT",
    amount,
    adminCommission,
    sender_phone: sender.phone,
    receiver_phone: receiver.phone,
  });

  return {
    transactionId,
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

  const sender = await User.findOne({ phone: senderPhone }); // Agent
  const receiver = await User.findOne({ phone: receiverPhone }); // User

  if (!sender)
    throw new AppError(httpStatus.NOT_FOUND, "Your number not found");
  if (!receiver)
    throw new AppError(httpStatus.NOT_FOUND, "Receiver number not found");

  if (receiver.role === "AGENT")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cash in money to an agent number."
    );
  if (receiver.role === "ADMIN")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cash in money to an admin number."
    );
  if (sender.status === "BLOCKED")
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account is Blocked. Please Contact With Your Admin."
    );

  const senderWallet = await Wallet.findOne({ userId: sender._id }); // agent wallet
  const receiverWallet = await Wallet.findOne({ userId: receiver._id }); // user wallet
  if (!senderWallet || !receiverWallet)
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

  if (
    senderWallet.userStatus === "BLOCKED" ||
    senderWallet.walletStatus === "BLOCKED"
  )
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account/Wallet is Blocked. Please Contact With Your Admin."
    );

  // --- Commission (Cash-In) ---
  const { agentCommission } = computeCashInCommission(amount);

  if (senderWallet.balance < amount)
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

  // Move principal amount from agent to user
  senderWallet.balance = round2(senderWallet.balance - amount);
  receiverWallet.balance = round2(receiverWallet.balance + amount);

  // Give agent commission bonus (admin gets nothing)
  senderWallet.balance = round2(senderWallet.balance + agentCommission);

  await senderWallet.save();
  await receiverWallet.save();

  const transactionId = generateTransactionId();

  await UserTransaction.create({
    transactionId,
    userId: receiver._id,
    userName: receiver.name,
    amount,
    type: "CASH-IN",
    receiver_phone: sender.phone,
  });

  await AgentCommissionHistory.create({
    transactionId,
    userId: sender._id,
    type: "CASH-IN",
    amount,
    commission: agentCommission,
    reference: receiver.phone,
    receiverPhone: receiver.phone,
  });

  // NOTE: per request, add adminCommission only on AllTransactions (admin gets 0 here)
  await AllTransactions.create({
    transactionId,
    senderId: sender._id,
    senderName: sender.name,
    senderRole: sender.role,
    receiverId: receiver._id,
    receiverName: receiver.name,
    receiverRole: receiver.role,
    transactionType: "CASH-IN",
    amount,
    adminCommission: 0,
    sender_phone: sender.phone,
    receiver_phone: receiver.phone,
  });

  return {
    transactionId,
    senderBalance: senderWallet.balance,
    receiverBalance: receiverWallet.balance,
    commissionAmount: agentCommission,
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
export const getWalletByUserId = async (userId: string) => {
  try {
    return await Wallet.findOne({ userId }).select(
      "balance userStatus walletStatus userId"
    );
  } catch (e) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid userId format.", "");
  }
};

export const WalletServices = {
  withdrawBalance,
  transferMoney,
  cashInMoney,
  getAllWallets,
  getWalletByUserId,
  updateUserWallet,
};
