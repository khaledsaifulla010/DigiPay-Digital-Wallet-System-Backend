import express from "express";
import { UserTransactionHistoryControllers } from "./userTransactionHistory.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import { UserRole } from "../../user/user.interface";

const router = express.Router();

router.get("/",checkAuth(UserRole.USER), UserTransactionHistoryControllers.getTransactionHistory);

export const UserTransactionRoutes = router;
