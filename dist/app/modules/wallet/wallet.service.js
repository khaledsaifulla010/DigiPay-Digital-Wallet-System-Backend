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
exports.WalletServices = exports.getWalletById = exports.getAllWallets = exports.cashInMoney = exports.withdrawBalance = exports.transferMoney = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/appError/AppError"));
const agentCommissionHistory_model_1 = require("../transaction/agentCommissionHistory/agentCommissionHistory.model");
const allTransactions_model_1 = require("../transaction/allTransactions/allTransactions.model");
const userTransactionHistory_model_1 = require("../transaction/userTransactionHistory/userTransactionHistory.model");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const mongoose_1 = require("mongoose");
// USER ROLE //
// Send money to another user
const transferMoney = (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderPhone, receiverPhone, amount, }) {
    if (senderPhone === receiverPhone) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot transfer to yourself");
    }
    const sender = yield user_model_1.User.findOne({ phone: senderPhone });
    const receiver = yield user_model_1.User.findOne({ phone: receiverPhone });
    if (!sender) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Your number not found");
    }
    if (!receiver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver number not found");
    }
    if (receiver.role === "AGENT") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot send money to an agent number.");
    }
    if (receiver.role === "ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot send money to an admin number.");
    }
    if (sender.status === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account is Blocked. Please Contact With Your Admin.");
    }
    const senderWallet = yield wallet_model_1.Wallet.findOne({ userId: sender._id });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ userId: receiver._id });
    if (!senderWallet || !receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    if (senderWallet.userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account is Blocked. Please Contact With Your Admin.");
    }
    if (senderWallet.walletStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Wallet is Blocked. Please Contact With Your Admin.");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    yield userTransactionHistory_model_1.UserTransaction.create({
        userId: sender._id,
        userName: sender.name,
        type: "SEND-MONEY",
        amount: amount,
        receiver_phone: receiver.phone,
    });
    yield allTransactions_model_1.AllTransactions.create({
        senderId: sender._id,
        senderName: sender.name,
        senderRole: sender.role,
        receiverId: receiver._id,
        receiverName: receiver.name,
        receiverRole: receiver.role,
        transactionType: "SEND-MONEY",
        amount: amount,
        sender_phone: sender.phone,
        receiver_phone: receiver.phone,
    });
    return {
        name: sender.name,
        senderBalance: senderWallet.balance,
        receiverBalance: receiverWallet.balance,
    };
});
exports.transferMoney = transferMoney;
// Withdraw money (Cashout)
const withdrawBalance = (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderPhone, receiverPhone, amount, }) {
    if (senderPhone === receiverPhone) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cashout to yourself");
    }
    const sender = yield user_model_1.User.findOne({ phone: senderPhone });
    const receiver = yield user_model_1.User.findOne({ phone: receiverPhone });
    if (!sender) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Your number not found");
    }
    if (!receiver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent number not found");
    }
    if (receiver.role === "USER") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cashout money to an user number.");
    }
    if (receiver.role === "ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cashout money to an admin number.");
    }
    if (sender.status === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account is Blocked. Please Contact With Your Admin.");
    }
    const senderWallet = yield wallet_model_1.Wallet.findOne({ userId: sender._id });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ userId: receiver._id });
    if (!senderWallet || !receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    if (senderWallet.userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account is Blocked. Please Contact With Your Admin.");
    }
    if (senderWallet.walletStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Wallet is Blocked. Please Contact With Your Admin.");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    const commission = Number(((amount * 4) / 1000).toFixed(2));
    senderWallet.balance -= commission;
    receiverWallet.balance += commission;
    yield senderWallet.save();
    yield receiverWallet.save();
    yield userTransactionHistory_model_1.UserTransaction.create({
        userId: sender._id,
        userName: sender.name,
        type: "CASHOUT",
        amount: amount,
        receiver_phone: receiver.phone,
    });
    yield agentCommissionHistory_model_1.AgentCommissionHistory.create({
        userId: receiver._id,
        type: "CASHOUT",
        amount: amount,
        commission: commission,
        reference: receiver.phone,
    });
    yield allTransactions_model_1.AllTransactions.create({
        senderId: sender._id,
        senderName: sender.name,
        senderRole: sender.role,
        receiverId: receiver._id,
        receiverName: receiver.name,
        receiverRole: receiver.role,
        transactionType: "CASHOUT",
        amount: amount,
        sender_phone: sender.phone,
        receiver_phone: receiver.phone,
    });
    return {
        senderBalance: senderWallet.balance,
        receiverBalance: receiverWallet.balance,
    };
});
exports.withdrawBalance = withdrawBalance;
// AGENT ROLE //
// Add money to any user's wallet (cash-in)
const cashInMoney = (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderPhone, receiverPhone, amount, }) {
    if (senderPhone === receiverPhone) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cash in to yourself");
    }
    const sender = yield user_model_1.User.findOne({ phone: senderPhone });
    const receiver = yield user_model_1.User.findOne({ phone: receiverPhone });
    if (!sender) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Your number not found");
    }
    if (!receiver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver number not found");
    }
    if (receiver.role === "AGENT") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cash in money to an agent number.");
    }
    if (receiver.role === "ADMIN") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cash in money to an admin number.");
    }
    if (sender.status === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account is Blocked. Please Contact With Your Admin.");
    }
    const senderWallet = yield wallet_model_1.Wallet.findOne({ userId: sender._id });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ userId: receiver._id });
    if (!senderWallet || !receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    if (senderWallet.userStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Account is Blocked. Please Contact With Your Admin.");
    }
    if (senderWallet.walletStatus === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your Wallet is Blocked. Please Contact With Your Admin.");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    const commission = Number(((amount * 4) / 1000).toFixed(2));
    senderWallet.balance += commission;
    yield senderWallet.save();
    yield receiverWallet.save();
    yield userTransactionHistory_model_1.UserTransaction.create({
        userId: sender._id,
        userName: sender.name,
        amount: amount,
        type: "CASH-IN",
        reference: sender.phone,
    });
    yield agentCommissionHistory_model_1.AgentCommissionHistory.create({
        userId: sender._id,
        type: "CASH-IN",
        amount: amount,
        commission: commission,
        reference: receiver.phone,
    });
    yield allTransactions_model_1.AllTransactions.create({
        senderId: sender._id,
        senderName: sender.name,
        senderRole: sender.role,
        receiverId: receiver._id,
        receiverName: receiver.name,
        receiverRole: receiver.role,
        transactionType: "CASH-IN",
        amount: amount,
        sender_phone: sender.phone,
        receiver_phone: receiver.phone,
    });
    return {
        senderBalance: senderWallet.balance,
        receiverBalance: receiverWallet.balance,
        commissionAmount: commission,
    };
});
exports.cashInMoney = cashInMoney;
// ADMIN ROLE //
// GET ALL WALLETS //
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    return wallet_model_1.Wallet.find();
});
exports.getAllWallets = getAllWallets;
// UPDATE A USER WALLET STATUS //
const updateUserWallet = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only ADMIN can update wallet status.", "");
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found!", "");
    }
    const allowedUpdate = {};
    if (payload.walletStatus) {
        allowedUpdate.walletStatus = payload.walletStatus;
    }
    if (!allowedUpdate.walletStatus) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "As an ADMIN you can update only user wallet status.", "");
    }
    const updatedWallet = yield wallet_model_1.Wallet.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId) }, allowedUpdate, { new: true, runValidators: true });
    return updatedWallet;
});
// Get A Wallet //
const getWalletById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return wallet_model_1.Wallet.findById(id);
});
exports.getWalletById = getWalletById;
exports.WalletServices = {
    withdrawBalance: exports.withdrawBalance,
    transferMoney: exports.transferMoney,
    cashInMoney: exports.cashInMoney,
    getAllWallets: exports.getAllWallets,
    getWalletById: exports.getWalletById,
    updateUserWallet,
};
