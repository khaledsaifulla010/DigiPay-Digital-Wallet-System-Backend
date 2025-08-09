"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCommissionHistoryServices = exports.getAgentTransactions = void 0;
const mongoose_1 = require("mongoose");
const agentCommissionHistory_model_1 = require("./agentCommissionHistory.model");
const getAgentTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectUserId = typeof userId === "string" ? new mongoose_1.Types.ObjectId(userId) : userId;
    const transactions = yield agentCommissionHistory_model_1.AgentCommissionHistory.find({
        userId: objectUserId,
    }).sort({
        createdAt: -1,
    });
    return transactions;
});
exports.getAgentTransactions = getAgentTransactions;
exports.AgentCommissionHistoryServices = {
    getAgentTransactions: exports.getAgentTransactions,
};
