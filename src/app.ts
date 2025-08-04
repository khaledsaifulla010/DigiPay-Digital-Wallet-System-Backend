import express, { Request, Response } from "express";
import cors from "cors";
const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("🏦 Welcome to DigiPay Digital Wallet System.");
});

export default app;
