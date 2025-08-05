/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { WalletServices, withdrawBalance } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// Add money (top-up)
export const topUpWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, amount } = req.body;

    const balance = await WalletServices.topUpWallet(phone, amount);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Top-up of ${amount} Taka was completed successfully. New balance: ${balance.balance} Taka.`,
      data: balance,
    });
  }
);

// Withdraw money
export const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const { phone, amount } = req.body;
  const withdrawAmount = await withdrawBalance({ phone, amount });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully withdrew ${amount} Taka from your wallet. New balance: ${withdrawAmount.balance} Taka.`,
    data: withdrawAmount,
  });
});

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
      Sender_Phone: senderPhone,
      Receiver_Phone: receiverPhone,
      Transfer_Amount: amount,
      Sender_Balance: result.senderBalance,
    },
  });
});

export const WalletControllers = {
  topUpWallet,
  withdrawMoney,
  transferMoney,
};
