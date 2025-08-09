import { IUser, UserRole, UserStatus } from "./user.interface";
import bcrypt from "bcryptjs";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError/AppError";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { Types } from "mongoose";
// Create User //
export const createUser = async (userData: IUser) => {
  const userEmail = userData.email;
  const isExistUser = await User.findOne({ email: userEmail });

  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist!", "");
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
    role: userData.role || UserRole.USER,
    status: userData.status || UserStatus.ACTIVE,
  });

  const walletBalance = newUser.role === UserRole.AGENT ? 500 : 50;

  if ([UserRole.USER, UserRole.AGENT].includes(newUser.role)) {

     if (!newUser._id) {
       throw new Error("User _id is undefined or null, cannot create wallet");
     }

    const newWallet = await Wallet.create({
      userId: newUser._id,
      userName: newUser.name,
      userEmail: newUser.email,
      userPhone: newUser.phone,
      userRole: newUser.role,
      userStatus: newUser.status,
      balance: walletBalance,
    });

    newUser.wallet = new Types.ObjectId(newWallet._id);
    await newUser.save();
  }
  const userWithWallet = await User.findById(newUser._id).populate({
    path: "wallet",
    select: "balance status",
  });
  return { user: userWithWallet };
};

// Get All User //
export const getAllUsers = async () => {
  return User.find().select("-password");
};

// Get A User //
export const getUserById = async (id: string) => {
  return User.findById(id).select("-password");
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
};
