import express from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { WithdrawValidationSchema } from "./withdraw/withdraw.validation";
import { TransferValidationSchema } from "./transfer/transfer.validation";
import { WalletControllers } from "./wallet.controller";
import { CashInValidationSchema } from "./cashin/cashin.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { ALL_ROLES, ROLES } from "../../constants/roles";


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
  checkAuth(ROLES.ADMIN), // only admins
  WalletControllers.getAllWallets
);



router.get("/me", checkAuth(...ALL_ROLES), WalletControllers.getMyWallet);
router.get(
  "/:userId",
  checkAuth(...ALL_ROLES),
  WalletControllers.getWalletByUserId
);


router.patch(
  "/:id",
  checkAuth(...ALL_ROLES),
  WalletControllers.updateUserWallet
);
export const WalletRoutes = router;
