/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/appError/AppError";

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
const getWalletById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await WalletServices.getWalletById(req.params.id);

    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet Not Found!", "");
    }

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Wallet Retrieve Sucessfully.",
      data: wallet,
    });
  }
);

export const WalletControllers = {
  withdrawMoney,
  transferMoney,
  cashInMoney,
  getAllWallets,
  getWalletById,
};
