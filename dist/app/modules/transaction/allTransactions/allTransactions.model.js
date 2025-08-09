"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllTransactions = void 0;
const mongoose_1 = require("mongoose");
const AllTransactionHistorySchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    senderRole: {
        type: String,
        enum: ["USER", "AGENT", "ADMIN"],
        required: true,
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
    },
    receiverRole: {
        type: String,
        enum: ["USER", "AGENT", "ADMIN"],
        required: true,
    },
    transactionType: {
        type: String,
        enum: ["CASH-IN", "SEND-MONEY", "CASHOUT"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    sender_phone: {
        type: String,
        required: true,
    },
    receiver_phone: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });
exports.AllTransactions = (0, mongoose_1.model)("AllTransactions", AllTransactionHistorySchema);
