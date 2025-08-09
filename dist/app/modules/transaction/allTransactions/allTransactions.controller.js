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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllTransactionsControllers = exports.getAllTransactions = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const allTransactions_service_1 = require("./allTransactions.service");
const AppError_1 = __importDefault(require("../../../errorHelpers/appError/AppError"));
// GET All Transactions
exports.getAllTransactions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield allTransactions_service_1.AllTransactionsServices.getAllTransactions();
    if (!transactions.length) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.NOT_FOUND,
            success: false,
            message: "No transaction found.",
            data: [],
        });
        return;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Transaction history fetched successfully",
        data: transactions,
    });
}));
// GET A Transaction
const getATransactionsById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield allTransactions_service_1.AllTransactionsServices.getATransactionsById(req.params.id);
    if (!transaction) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Transaction Not Found!", "");
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Transaction Retrieve Sucessfully.",
        data: transaction,
    });
}));
exports.AllTransactionsControllers = {
    getAllTransactions: exports.getAllTransactions,
    getATransactionsById,
};
