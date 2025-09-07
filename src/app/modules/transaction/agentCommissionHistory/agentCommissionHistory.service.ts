/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Types } from "mongoose";
import { AgentCommissionHistory } from "./agentCommissionHistory.model";

const toObjectId = (id: string | Types.ObjectId) =>
  typeof id === "string" ? new Types.ObjectId(id) : id;

type StatsOpts = {
  range?: "today" | "7d" | "30d";
  from?: string; 
  to?: string;
};

const dateRangeToMatch = (opts?: StatsOpts) => {
  if (!opts) return {};
  const now = new Date();

  let start: Date | undefined;
  let end: Date | undefined;

  if (opts.range === "today") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  } else if (opts.range === "7d") {
    end = now;
    start = new Date(now);
    start.setDate(start.getDate() - 7);
  } else if (opts.range === "30d") {
    end = now;
    start = new Date(now);
    start.setDate(start.getDate() - 30);
  }

  if (opts.from) start = new Date(opts.from);
  if (opts.to) end = new Date(opts.to);

  if (start || end) {
    return {
      createdAt: {
        ...(start ? { $gte: start } : {}),
        ...(end ? { $lte: end } : {}),
      },
    };
  }
  return {};
};

export const createAgentCommissionRecord = async (params: {
  userId: string | Types.ObjectId;
  type: "CASH-IN" | "CASHOUT";
  amount: number;
  commission: number;
  reference?: string;
  receiverPhone?: string;
}) => {
  const doc = await AgentCommissionHistory.create({
    userId: toObjectId(params.userId),
    type: params.type,
    amount: params.amount,
    commission: params.commission,
    reference: params.reference,
  });
  return doc;
};

export const getAgentTransactions = async (
  userId: string | Types.ObjectId,
  opts?: { page?: number; limit?: number }
) => {
  const page = Math.max(1, Number(opts?.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(opts?.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = { userId: toObjectId(userId) };

  const [items, total] = await Promise.all([
    AgentCommissionHistory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AgentCommissionHistory.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getAgentCommissionStats = async (
  userId: string | Types.ObjectId,
  opts?: StatsOpts
) => {
  const match: any = { userId: toObjectId(userId), ...dateRangeToMatch(opts) };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
        totalCommission: { $sum: "$commission" },
        count: { $sum: 1 },
      },
    },
  ];

  const rows = await AgentCommissionHistory.aggregate(pipeline);

  const base = { totalAmount: 0, totalCommission: 0, count: 0 };
  const cashIn = { ...base };
  const cashOut = { ...base };

  for (const r of rows) {
    if (r._id === "CASH-IN") {
      cashIn.totalAmount = r.totalAmount || 0;
      cashIn.totalCommission = r.totalCommission || 0;
      cashIn.count = r.count || 0;
    }
    if (r._id === "CASHOUT") {
      cashOut.totalAmount = r.totalAmount || 0;
      cashOut.totalCommission = r.totalCommission || 0;
      cashOut.count = r.count || 0;
    }
  }

  return {
    overall: {
      totalAmount: cashIn.totalAmount + cashOut.totalAmount,
      totalCommission: cashIn.totalCommission + cashOut.totalCommission,
      count: cashIn.count + cashOut.count,
    },
    cashIn,
    cashOut,
  };
};

export const AgentCommissionHistoryServices = {
  createAgentCommissionRecord,
  getAgentTransactions,
  getAgentCommissionStats,
};
