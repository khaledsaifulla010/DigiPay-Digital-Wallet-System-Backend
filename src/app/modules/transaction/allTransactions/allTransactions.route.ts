import express from "express";
import { checkAuth } from "../../../middlewares/checkAuth";

import { AllTransactionsControllers } from "./allTransactions.controller";
import { ROLES } from "../../../constants/roles";

const router = express.Router();

router.get(
  "/all-transactions",
  checkAuth(ROLES.ADMIN),
  AllTransactionsControllers.getAllTransactions
);

router.get(
  "/:id",
  checkAuth(ROLES.ADMIN),
  AllTransactionsControllers.getATransactionsById
);

export const AllTransactionsRoutes = router;
