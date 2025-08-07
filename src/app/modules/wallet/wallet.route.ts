import express from "express";
import { WalletControllers } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
// import { TopUpValidationSchema } from "./topup/topup.validation";
import { WithdrawValidationSchema } from "./withdraw/withdraw.validation";
import { TransferValidationSchema } from "./transfer/transfer.validation";

const router = express.Router();

// router.post(
//   "/topup",
//   validateRequest(TopUpValidationSchema),
//   WalletControllers.topUpWallet
// );

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
export const WalletRoutes = router;
