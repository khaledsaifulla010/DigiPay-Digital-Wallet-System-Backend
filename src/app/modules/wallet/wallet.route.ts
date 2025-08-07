import express from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { WithdrawValidationSchema } from "./withdraw/withdraw.validation";
import { TransferValidationSchema } from "./transfer/transfer.validation";
import { WalletControllers } from "./wallet.controller";
import { CashInValidationSchema } from "./cashin/cashin.validation";

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
export const WalletRoutes = router;
