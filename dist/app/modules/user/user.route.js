"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("./user.interface");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), user_controller_1.UserControllers.getAllUsers);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN), user_controller_1.UserControllers.getUserById);
router.patch("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), user_controller_1.UserControllers.changeAgentStatus);
exports.UserRoutes = router;
