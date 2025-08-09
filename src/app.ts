import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/errorHelpers/globalErrorHandler/globalErrorHandler";
import NotFoundRoute from "./app/middlewares/NotFoundRoute";
import passport from "passport";
import "./app/config/passport";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

// API END POINTS
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("🏦 Welcome to DigiPay Digital Wallet System.");
});

//GLOBAL ERROR Handler
app.use(globalErrorHandler);

// NOT FOUND ROUTE //
app.use(NotFoundRoute);

export default app;
