/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Response } from "express";
import { envVars } from "../config/env";

export type AuthCookiePayload = {
  accessToken?: string;
  refreshToken?: string;
};

export const setAuthCookie = (
  res: Response,
  tokenInfo: AuthCookiePayload
): void => {
  const isProd = envVars.NODE_ENV === "production";

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
};

export const clearAuthCookie = (res: Response): void => {
  const isProd = envVars.NODE_ENV === "production";
  const opts = {
    httpOnly: true,
    secure: isProd,
    sameSite: "none" as const,
    path: "/",
  };
  res.clearCookie("accessToken", opts);
  res.clearCookie("refreshToken", opts);
};
