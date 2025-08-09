import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Token Received!", "");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exist!", "");
      }
      if (isUserExist.status === "BLOCKED") {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Blocked!", "");
      }

      //   Role verification
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not permitted to view this route!",
          ""
        );
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
