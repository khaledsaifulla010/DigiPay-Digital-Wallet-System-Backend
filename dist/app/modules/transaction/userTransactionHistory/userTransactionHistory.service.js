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
exports.UserTransactionHistoryServices = exports.getUserTransactions = void 0;
const mongoose_1 = require("mongoose");
const userTransactionHistory_model_1 = require("./userTransactionHistory.model");
const getUserTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const objectUserId = typeof userId === "string" ? new mongoose_1.Types.ObjectId(userId) : userId;
    const transactions = yield userTransactionHistory_model_1.UserTransaction.find({
        userId: objectUserId,
    }).sort({
        createdAt: -1,
    });
    return transactions;
});
exports.getUserTransactions = getUserTransactions;
exports.UserTransactionHistoryServices = {
    getUserTransactions: exports.getUserTransactions,
};
