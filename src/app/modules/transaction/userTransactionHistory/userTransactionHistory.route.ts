import express from "express";
import { UserTransactionHistoryControllers } from "./userTransactionHistory.controller";
import { checkAuth } from "../../../middlewares/checkAuth";

import { ROLES } from "../../../constants/roles";

const router = express.Router();

router.get("/",checkAuth(ROLES.USER), UserTransactionHistoryControllers.getTransactionHistory);

export const UserTransactionRoutes = router;
