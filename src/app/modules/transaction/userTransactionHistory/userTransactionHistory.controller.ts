// src/modules/transaction/userHistory/userHistory.controller.ts

import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../utils/catchAsync";
import { UserTransactionHistoryServices } from "./userTransactionHistory.service";
import { sendResponse } from "../../../utils/sendResponse";

export const getTransactionHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    const transactions =
      await UserTransactionHistoryServices.getUserTransactions(userId);

    if (!transactions.length) {
      sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "No transactions found for the user.",
        data: [],
      });
      return;
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User transaction history fetched successfully",
      data: transactions,
    });
  }
);

export const UserTransactionHistoryControllers = {
  getTransactionHistory,
};
