"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userTransactionHistory_controller_1 = require("./userTransactionHistory.controller");
const checkAuth_1 = require("../../../middlewares/checkAuth");
const user_interface_1 = require("../../user/user.interface");
const router = express_1.default.Router();
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.USER), userTransactionHistory_controller_1.UserTransactionHistoryControllers.getTransactionHistory);
exports.UserTransactionRoutes = router;
