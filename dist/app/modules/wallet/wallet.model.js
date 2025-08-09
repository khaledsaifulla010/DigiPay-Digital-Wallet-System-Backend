"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const user_interface_1 = require("../user/user.interface");
const walletSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userPhone: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        enum: ["USER", "AGENT", "ADMIN"],
        required: true,
    },
    userStatus: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: user_interface_1.UserStatus.ACTIVE,
        required: true,
    },
    walletStatus: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: wallet_interface_1.wallletStatus.ACTIVE,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 50,
    },
}, { timestamps: true, versionKey: false });
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
