import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { UserTransactionRoutes } from "../modules/transaction/userTransactionHistory/userTransactionHistory.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AllTransactionsRoutes } from "../modules/transaction/allTransactions/allTransactions.route";
export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/wallet",
    route: WalletRoutes,
  },
  {
    path: "/user-transaction",
    route: UserTransactionRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/transaction",
    route: AllTransactionsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
