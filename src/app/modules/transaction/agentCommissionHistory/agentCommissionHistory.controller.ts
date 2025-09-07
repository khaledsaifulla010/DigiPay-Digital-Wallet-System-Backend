/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { AgentCommissionHistoryServices } from "./agentCommissionHistory.service";


const getAgentTransactions = async (req: Request, res: Response) => {
  const authUserId = (req as any).user?._id || (req as any).user?.userId;
  const userId = (authUserId as string) || (req.query.userId as string);

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "userId is required",
      data: null,
    });
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await AgentCommissionHistoryServices.getAgentTransactions(
    userId,
    {
      page,
      limit,
    }
  );

  return res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent transactions fetched successfully",
    data: result,
  });
};

const getAgentStats = async (req: Request, res: Response) => {
  const authUserId = (req as any).user?._id || (req as any).user?.userId;
  const userId = (authUserId as string) || (req.query.userId as string);

  if (!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "userId is required",
      data: null,
    });
  }

  const range = req.query.range as "today" | "7d" | "30d" | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const stats = await AgentCommissionHistoryServices.getAgentCommissionStats(
    userId,
    {
      range,
      from,
      to,
    }
  );

  return res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent commission stats fetched successfully",
    data: stats,
  });
};

export const AgentCommissionHistoryControllers = {
  getAgentTransactions,
  getAgentStats,
};
