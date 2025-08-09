"use strict";
// src/modules/transaction/userHistory/userHistory.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCommissionHistoryControllers = exports.getAgentTransactions = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const agentCommissionHistory_service_1 = require("./agentCommissionHistory.service");
exports.getAgentTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const transactions = yield agentCommissionHistory_service_1.AgentCommissionHistoryServices.getAgentTransactions(userId);
    if (!transactions.length) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.NOT_FOUND,
            success: false,
            message: "No transactions found for the user.",
            data: [],
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Agent transaction history fetched successfully",
        data: transactions,
    });
}));
exports.AgentCommissionHistoryControllers = {
    getAgentTransactions: exports.getAgentTransactions,
};
