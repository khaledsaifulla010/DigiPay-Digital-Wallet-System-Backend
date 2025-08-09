/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/appError/AppError";
import httpStatus from "http-status-codes";
import { UserStatus } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";
// CREATE A USER CONTROLLER
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Sucessfully.",
      data: user,
    });
  }
);
// GET ALL USER CONTROLLER
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Retrieve Sucessfully.",
      data: users,
    });
  }
);

// GET A USER CONTROLLER
const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.getUserById(req.params.id);

    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "User Not Found!", "");
    }

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Retrieve Sucessfully.",
      data: user,
    });
  }
);
// CHANGE A USER STATUS CONTROLLER
const changeAgentStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const updatedAgent = await UserServices.changeAgentStatus(
    req.params.id,
    status,
    req.user as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Agent has been ${
      status === UserStatus.ACTIVE ? "Approved" : "Suspended"
    } successfully.`,
    data: updatedAgent,
  });
});
export const UserControllers = {
  createUser,
  getAllUsers,
  getUserById,
  changeAgentStatus,
};
