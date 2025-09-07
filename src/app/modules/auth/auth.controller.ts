/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import AppError from "../../errorHelpers/appError/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { clearAuthCookie, setAuthCookie } from "../../utils/setCookie";


// credentialsLogin
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) return next(new AppError(401, error, ""));
      if (!user)
        return next(new AppError(401, info?.message ?? "Unauthorized", ""));

      const userTokens = createUserTokens(user);
      const { password: _pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged in Sucessfully.",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

// getNewAccessToken
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token received from cookies",
      ""
    );
  }

  const accessToken: string = await AuthService.getNewAccessToken(refreshToken);

  setAuthCookie(res, { accessToken });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Access Token Retrieved Sucessfully.",
    data: { accessToken },
  });
});


// logout
const logout = catchAsync(async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully.",
    data: null,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout
};
