import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/errorHelpers/globalErrorHandler/globalErrorHandler";
import NotFoundRoute from "./app/middlewares/NotFoundRoute";
import passport from "passport";
import "./app/config/passport";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://digipay-digital-wallet-system-front.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send("🏦 Welcome to DigiPay Digital Wallet System.");
});

app.use(globalErrorHandler);
app.use(NotFoundRoute);

export default app;
