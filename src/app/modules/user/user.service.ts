import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError/AppError";
import { envVars } from "../../config/env";

// Create User //
export const createUser = async (userData: IUser) => {
  const userEmail = userData.email;
  const isExistUser = await User.findOne({ email: userEmail });

  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist!","");
  }

  const hasedPassword = await bcrypt.hash(
    userData.password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    ...userData,
    password: hasedPassword,
    role: userData.role || "USER",
  });

  return user;
};

export const UserServices = {
  createUser,
};
