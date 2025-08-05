import express from "express";
import { WalletControllers } from "./wallet.controller";

const router = express.Router();

router.post("/topup", WalletControllers.topUpWallet);

export const WalletRoutes = router;
