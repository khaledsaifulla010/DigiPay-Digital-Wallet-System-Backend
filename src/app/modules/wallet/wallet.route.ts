import express from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { WithdrawValidationSchema } from "./withdraw/withdraw.validation";
import { TransferValidationSchema } from "./transfer/transfer.validation";
import { WalletControllers } from "./wallet.controller";
import { CashInValidationSchema } from "./cashin/cashin.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";

const router = express.Router();

router.post(
  "/withdraw",
  validateRequest(WithdrawValidationSchema),
  WalletControllers.withdrawMoney
);
router.post(
  "/transfer",
  validateRequest(TransferValidationSchema),
  WalletControllers.transferMoney
);
router.post(
  "/cashIn",
  validateRequest(CashInValidationSchema),
  WalletControllers.cashInMoney
);

router.get(
  "/all-wallets",
  checkAuth(UserRole.ADMIN),
  WalletControllers.getAllWallets
);

router.get("/:id", checkAuth(UserRole.ADMIN), WalletControllers.getWalletById);
router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  WalletControllers.updateUserWallet
);

export const WalletRoutes = router;
