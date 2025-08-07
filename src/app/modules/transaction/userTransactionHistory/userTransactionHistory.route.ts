import express from "express";
import { UserTransactionHistoryControllers } from "./userTransactionHistory.controller";

const router = express.Router();

router.get("/", UserTransactionHistoryControllers.getTransactionHistory);

export const UserTransactionRoutes = router;
