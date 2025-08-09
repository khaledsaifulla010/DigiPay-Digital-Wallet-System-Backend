import express from "express";

import { checkAuth } from "../../../middlewares/checkAuth";
import { UserRole } from "../../user/user.interface";
import { AgentCommissionHistoryControllers } from "./agentCommissionHistory.controller";

const router = express.Router();

router.get(
  "/",
  checkAuth(UserRole.AGENT),
  AgentCommissionHistoryControllers.getAgentTransactions
);

export const AgentCommissionHistoryRoutes = router;
