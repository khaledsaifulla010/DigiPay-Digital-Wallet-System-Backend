/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { AllTransactionsServices } from "./allTransactions.service";
import AppError from "../../../errorHelpers/appError/AppError";

// GET All Transactions
export const getAllTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const transactions = await AllTransactionsServices.getAllTransactions();

    if (!transactions.length) {
      sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "No transaction found.",
        data: [],
      });
      return;
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Transaction history fetched successfully",
      data: transactions,
    });
  }
);

// GET A Transaction
const getATransactionsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await AllTransactionsServices.getATransactionsById(
      req.params.id
    );

    if (!transaction) {
      throw new AppError(httpStatus.BAD_REQUEST, "Transaction Not Found!", "");
    }

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Transaction Retrieve Sucessfully.",
      data: transaction,
    });
  }
);

export const AllTransactionsControllers = {
  getAllTransactions,
  getATransactionsById,
};
