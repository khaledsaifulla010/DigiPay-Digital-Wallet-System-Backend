"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const userTransactionHistory_route_1 = require("../modules/transaction/userTransactionHistory/userTransactionHistory.route");
const auth_route_1 = require("../modules/auth/auth.route");
const allTransactions_route_1 = require("../modules/transaction/allTransactions/allTransactions.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRoutes,
    },
    {
        path: "/user-transaction",
        route: userTransactionHistory_route_1.UserTransactionRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/transaction",
        route: allTransactions_route_1.AllTransactionsRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
