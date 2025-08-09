/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/appError/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
// credentialsLogin
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(new AppError(401, error, ""));
      }
      if (!user) {
        return next(new AppError(401, info.message, ""));
      }
      const userTokens = createUserTokens(user);
      const { password: pass, ...rest } = user.toObject();
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged in Sucessfully.",
        data: {
          accessToken: userTokens.accessToken,
          refresToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

export const AuthControllers = {
  credentialsLogin,
};
