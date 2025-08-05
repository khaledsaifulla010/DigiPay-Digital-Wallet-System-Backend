/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { WalletServices } from "./wallet.service";
import { TopUpValidation } from "./wallet.topup.validation";
import { catchAsync } from "../../utils/catchAsync";

export const topUpWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = TopUpValidation.parse(req.body);
    const balance = await WalletServices.topUpWallet(
      validated.phone,
      validated.amount
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Top-up successful",
      data: balance,
    });
  }
);

export const WalletControllers = {
  topUpWallet,
};
