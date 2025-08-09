"use strict";
/* eslint-disable no-console */
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
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("../config/env");
const wallet_model_1 = require("../modules/wallet/wallet.model");
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("../modules/wallet/wallet.interface");
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVars.ADMIN_EMAIL,
        });
        if (isAdminExist) {
            console.log("Admin already exists");
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const admin = yield user_model_1.User.create({
            name: "Khaled Saifulla",
            role: "ADMIN",
            email: env_1.envVars.ADMIN_EMAIL,
            phone: env_1.envVars.ADMIN_PHONE,
            password: hashedPassword,
            status: "ACTIVE",
        });
        const wallet = yield wallet_model_1.Wallet.create({
            userId: admin._id,
            userName: admin.name,
            userEmail: admin.email,
            userPhone: admin.phone,
            userRole: admin.role,
            userStatus: admin.status,
            walletStatus: wallet_interface_1.wallletStatus.ACTIVE,
            balance: 50000,
        });
        admin.wallet = new mongoose_1.Types.ObjectId(wallet._id);
        yield admin.save();
        console.log("Admin Created");
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedAdmin = seedAdmin;
