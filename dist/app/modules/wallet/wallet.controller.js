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
exports.WalletControllers = exports.cashInMoney = exports.withdrawMoney = exports.transferMoney = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_service_1 = require("./wallet.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/appError/AppError"));
//  USER ROLE
// Send money to another user
exports.transferMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderPhone, receiverPhone, amount } = req.body;
    const result = yield wallet_service_1.WalletServices.transferMoney({
        senderPhone,
        receiverPhone,
        amount,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Successfully transferred ${amount} Taka from ${senderPhone} to ${receiverPhone}`,
        data: {
            Sender_Name: result.name,
            Sender_Phone: senderPhone,
            Receiver_Phone: receiverPhone,
            Transfer_Amount: amount,
            Sender_Balance: result.senderBalance,
        },
    });
}));
// Withdraw money
exports.withdrawMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderPhone, receiverPhone, amount } = req.body;
    const result = yield wallet_service_1.WalletServices.withdrawBalance({
        senderPhone,
        receiverPhone,
        amount,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Successfully cashout ${amount} Taka from your wallet. New balance: ${result.senderBalance} Taka.`,
        data: {
            Sender_Phone: senderPhone,
            Receiver_Phone: receiverPhone,
            Cashout_Amount: amount,
            Sender_Balance: result.senderBalance,
        },
    });
}));
// AGENT ROLE
// Withdraw money from any user's wallet (cash-out)
exports.cashInMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderPhone, receiverPhone, amount } = req.body;
    const result = yield wallet_service_1.WalletServices.cashInMoney({
        senderPhone,
        receiverPhone,
        amount,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Successfully cash in ${amount} Taka from ${senderPhone} to ${receiverPhone}`,
        data: {
            Sender_Phone: senderPhone,
            Receiver_Phone: receiverPhone,
            CashIn_Amount: amount,
            Commission_Amount: result.commissionAmount,
            Sender_Balance: result.senderBalance,
        },
    });
}));
// ADMIN ROLE
// Get All Wallets
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_service_1.WalletServices.getAllWallets();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Wallets Retrieve Sucessfully.",
        data: wallets,
    });
}));
// Get A Wallets
const getWalletById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.WalletServices.getWalletById(req.params.id);
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet Not Found!", "");
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Wallet Retrieve Sucessfully.",
        data: wallet,
    });
}));
// UPDATE A USER WALLET STATUS //
const updateUserWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const userWallet = yield wallet_service_1.WalletServices.updateUserWallet(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User Wallet Status Updated Sucessfully.",
        data: userWallet,
    });
}));
exports.WalletControllers = {
    withdrawMoney: exports.withdrawMoney,
    transferMoney: exports.transferMoney,
    cashInMoney: exports.cashInMoney,
    getAllWallets,
    getWalletById,
    updateUserWallet,
};
