import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/errorHelpers/globalErrorHandler/globalErrorHandler";
const app = express();
app.use(express.json());

app.use(cors());

// API END POINTS
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("🏦 Welcome to DigiPay Digital Wallet System.");
});

//GLOBAL ERROR Handler
app.use(globalErrorHandler);

export default app;
