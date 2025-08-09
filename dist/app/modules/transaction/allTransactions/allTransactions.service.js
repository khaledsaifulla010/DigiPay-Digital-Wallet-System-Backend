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
exports.AllTransactionsServices = exports.getATransactionsById = exports.getAllTransactions = void 0;
const allTransactions_model_1 = require("./allTransactions.model");
// GET All Transactions
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield allTransactions_model_1.AllTransactions.find().sort({
        createdAt: -1,
    });
    return transactions;
});
exports.getAllTransactions = getAllTransactions;
// Get A Transaction //
const getATransactionsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return allTransactions_model_1.AllTransactions.findById(id);
});
exports.getATransactionsById = getATransactionsById;
exports.AllTransactionsServices = {
    getAllTransactions: exports.getAllTransactions,
    getATransactionsById: exports.getATransactionsById,
};
