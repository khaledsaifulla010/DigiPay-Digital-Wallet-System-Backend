// src/modules/transaction/userHistory/userHistory.controller.ts

import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { AgentCommissionHistoryServices } from "./agentCommissionHistory.service";

export const getAgentTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    const transactions =
      await AgentCommissionHistoryServices.getAgentTransactions(userId);

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
      message: "Agent transaction history fetched successfully",
      data: transactions,
    });
  }
);

export const AgentCommissionHistoryControllers = {
  getAgentTransactions,
};
