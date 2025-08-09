"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCommissionHistory = void 0;
const mongoose_1 = require("mongoose");
const AgentCommissionHistoryHistorySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["CASH-IN", "CASHOUT"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    commission: {
        type: Number,
        required: true,
    },
    reference: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true, versionKey: false });
exports.AgentCommissionHistory = (0, mongoose_1.model)("AgentCommissionHistory", AgentCommissionHistoryHistorySchema);
