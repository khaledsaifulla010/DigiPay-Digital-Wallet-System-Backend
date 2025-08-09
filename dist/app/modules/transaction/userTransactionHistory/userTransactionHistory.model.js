"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTransaction = void 0;
const mongoose_1 = require("mongoose");
const userTransactionHistorySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: {
        type: String,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["CASH-IN", "SEND-MONEY", "CASHOUT"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    receiver_phone: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
exports.UserTransaction = (0, mongoose_1.model)("UserTransaction", userTransactionHistorySchema);
