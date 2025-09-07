/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/appError/AppError";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../user/user.interface";
import { Types } from "mongoose";
import { ROLES } from "../../constants/roles";

//  USER ROLE
// Send money to another user
export const transferMoney = catchAsync(async (req: Request, res: Response) => {
  const { senderPhone, receiverPhone, amount } = req.body;
  const result = await WalletServices.transferMoney({
    senderPhone,
    receiverPhone,
    amount,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully transferred ${amount} Taka from ${senderPhone} to ${receiverPhone}`,
    data: {
      Sender_Name: result.name,
      Sender_Phone: senderPhone,
      Receiver_Phone: receiverPhone,
      Transfer_Amount: amount,
      Sender_Balance: result.senderBalance,
    },
  });
});

// Withdraw money
export const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { senderPhone, receiverPhone, amount } = req.body;
  const result = await WalletServices.withdrawBalance({
    senderPhone,
    receiverPhone,
    amount,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully cashout ${amount} Taka from your wallet. New balance: ${result.senderBalance} Taka.`,
    data: {
      Sender_Phone: senderPhone,
      Receiver_Phone: receiverPhone,
      Cashout_Amount: amount,
      Sender_Balance: result.senderBalance,
    },
  });
});

// AGENT ROLE

// Withdraw money from any user's wallet (cash-out)

export const cashInMoney = catchAsync(async (req: Request, res: Response) => {
  const { senderPhone, receiverPhone, amount } = req.body;
  const result = await WalletServices.cashInMoney({
    senderPhone,
    receiverPhone,
    amount,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully cash in ${amount} Taka from ${senderPhone} to ${receiverPhone}`,
    data: {
      Sender_Phone: senderPhone,
      Receiver_Phone: receiverPhone,
      CashIn_Amount: amount,
      Commission_Amount: result.commissionAmount,
      Sender_Balance: result.senderBalance,
    },
  });
});

// ADMIN ROLE
// Get All Wallets
const getAllWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await WalletServices.getAllWallets();
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Wallets Retrieve Sucessfully.",
      data: wallets,
    });
  }
);

// Get A Wallets
export const getMyWallet = catchAsync(async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const wallet = await WalletServices.getWalletByUserId(userId as string);
  if (!wallet)
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found.", "");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OK",
    data: wallet,
  });
});

export const getWalletByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const auth = req.user as JwtPayload;

  if (!Types.ObjectId.isValid(userId))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid userId.", "");
  if (auth.role !== ROLES.ADMIN && auth.userId !== userId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Not authorized to view this wallet.",
      ""
    );

  const wallet = await WalletServices.getWalletByUserId(userId);
  if (!wallet)
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found.", "");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OK",
    data: wallet,
  });
});
// UPDATE A USER WALLET STATUS //
const updateUserWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const userWallet = await WalletServices.updateUserWallet(
      userId,
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Wallet Status Updated Sucessfully.",
      data: userWallet,
    });
  }
);

export const WalletControllers = {
  withdrawMoney,
  transferMoney,
  cashInMoney,
  getAllWallets,
  getMyWallet,
  getWalletByUserId,
  updateUserWallet,
};
