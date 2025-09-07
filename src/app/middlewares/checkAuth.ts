/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { UserStatus, UserRole } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = (req.headers.authorization ?? "").trim();
      const cookieToken = (req as any).cookies?.accessToken as
        | string
        | undefined;

      let token: string | undefined;
      if (authHeader) {
        const parts = authHeader.split(" ");
        token =
          parts.length === 2 && /^Bearer$/i.test(parts[0])
            ? parts[1]
            : authHeader;
      } else if (cookieToken) {
        token = cookieToken;
      }

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "No token received.", "");
      }
      let verified: JwtPayload;
      try {
        verified = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;
      } catch {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid or expired token.",
          ""
        );
      }

      const user =
        (verified.userId && (await User.findById(verified.userId))) ||
        (verified.email && (await User.findOne({ email: verified.email })));

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User does not exist.", "");
      }

      if (user.status === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, "User is blocked.", "");
      }
      if (authRoles.length && !authRoles.includes(user.role as UserRole)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to view this route.",
          ""
        );
      }
      req.user = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
        ...verified,
      } as JwtPayload;

      next();
    } catch (err) {
      next(err);
    }
  };
