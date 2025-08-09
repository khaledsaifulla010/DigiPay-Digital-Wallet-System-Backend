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
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const seedAdmin_1 = require("./app/utils/seedAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DATABASE_URL);
        console.log("🗄️ Connected to DataBase.");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            try {
                console.log(`🏦 DigiPay-Digital-Wallet-System is Listening to Port ${env_1.envVars.PORT}.`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seedAdmin_1.seedAdmin)();
}))();
// UnHandled Rejection Error //
process.on("unhandledRejection", (err) => {
    console.log("UnHandled Rejection Detected!...🔌Server Shutting Down🔌", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// UnCaught Exception Error //
process.on("uncaughtException", (err) => {
    console.log("🔌UnCaught Exception Detected!...🔌Server Shutting Down🔌", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//  Signal Termination Error //
process.on("SIGTERM", () => {
    console.log("🔌SIGTERM Signal Received!...🔌Server Shutting Down🔌");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//  Signal Termination (Server Shutting Down manually)//
process.on("SIGINT", () => {
    console.log("🔌Server Shutting Down Gracefully...🔌");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
