import express from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import { AgentCommissionHistoryControllers } from "./agentCommissionHistory.controller";
import { ROLES } from "../../../constants/roles";

const router = express.Router();

router.get(
  "/",
  checkAuth(ROLES.AGENT),
  AgentCommissionHistoryControllers.getAgentTransactions
);

router.get(
  "/stats",
  checkAuth(ROLES.AGENT),
  AgentCommissionHistoryControllers.getAgentStats
);

export const AgentCommissionHistoryRoutes = router;
