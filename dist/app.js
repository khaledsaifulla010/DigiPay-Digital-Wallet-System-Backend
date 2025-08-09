"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/errorHelpers/globalErrorHandler/globalErrorHandler");
const NotFoundRoute_1 = __importDefault(require("./app/middlewares/NotFoundRoute"));
const passport_1 = __importDefault(require("passport"));
require("./app/config/passport");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./app/config/env");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use((0, cookie_parser_1.default)());
app.set("trust proxy", 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL,
    credentials: true,
}));
// API END POINTS
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.send("🏦 Welcome to DigiPay Digital Wallet System.");
});
//GLOBAL ERROR Handler
app.use(globalErrorHandler_1.globalErrorHandler);
// NOT FOUND ROUTE //
app.use(NotFoundRoute_1.default);
exports.default = app;
