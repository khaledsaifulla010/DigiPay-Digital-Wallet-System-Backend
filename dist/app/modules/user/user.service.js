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
exports.UserServices = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_interface_1 = require("./user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/appError/AppError"));
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("../wallet/wallet.interface");
// Create User //
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = userData.email;
    const isExistUser = yield user_model_1.User.findOne({ email: userEmail });
    if (isExistUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist!", "");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(userData.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const newUser = yield user_model_1.User.create(Object.assign(Object.assign({}, userData), { password: hashedPassword, role: userData.role || user_interface_1.UserRole.USER, status: userData.status || user_interface_1.UserStatus.ACTIVE }));
    const walletBalance = newUser.role === user_interface_1.UserRole.AGENT ? 500 : 50;
    if ([user_interface_1.UserRole.USER, user_interface_1.UserRole.AGENT].includes(newUser.role)) {
        if (!newUser._id) {
            throw new Error("User _id is undefined or null, cannot create wallet");
        }
        const newWallet = yield wallet_model_1.Wallet.create({
            userId: newUser._id,
            userName: newUser.name,
            userEmail: newUser.email,
            userPhone: newUser.phone,
            userRole: newUser.role,
            userStatus: newUser.status,
            walletStatus: wallet_interface_1.wallletStatus.ACTIVE,
            balance: walletBalance,
        });
        newUser.wallet = new mongoose_1.Types.ObjectId(newWallet._id);
        yield newUser.save();
    }
    const userWithWallet = yield user_model_1.User.findById(newUser._id).populate({
        path: "wallet",
        select: "balance status",
    });
    return { user: userWithWallet };
});
exports.createUser = createUser;
// UPDATE A USER //
const changeAgentStatus = (userId, status, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only Admins can approve or suspend agents.", "");
    }
    if (decodedToken.userId === userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admins cannot change their own status.", "");
    }
    if (![user_interface_1.UserStatus.ACTIVE, user_interface_1.UserStatus.BLOCKED].includes(status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid status value. Must be ACTIVE or BLOCKED.", "");
    }
    const agent = yield user_model_1.User.findById(userId).select("-password");
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found!", "");
    }
    if (agent.role !== user_interface_1.UserRole.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This action can only be applied to agents.", "");
    }
    agent.status = status;
    yield agent.save();
    yield wallet_model_1.Wallet.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId) }, { userStatus: status }, { new: true });
    return agent;
});
// Get All User //
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.User.find().select("-password");
});
exports.getAllUsers = getAllUsers;
// Get A User //
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.User.findById(id).select("-password");
});
exports.getUserById = getUserById;
exports.UserServices = {
    createUser: exports.createUser,
    getAllUsers: exports.getAllUsers,
    changeAgentStatus,
    getUserById: exports.getUserById,
};
