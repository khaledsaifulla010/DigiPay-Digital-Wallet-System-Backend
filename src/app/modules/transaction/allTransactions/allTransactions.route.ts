import express from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { UserRole } from "../../user/user.interface";
import { AllTransactionsControllers } from "./allTransactions.controller";

const router = express.Router();

router.get(
  "/all-transactions",
  checkAuth(UserRole.ADMIN),
  AllTransactionsControllers.getAllTransactions
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN),
  AllTransactionsControllers.getATransactionsById
);

export const AllTransactionsRoutes = router;
