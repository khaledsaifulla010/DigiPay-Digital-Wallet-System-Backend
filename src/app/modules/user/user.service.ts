import { IUser } from "./user.interface";
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

  const newUser = new User({
    ...userData,
    password: hashedPassword,
    role: userData.role || "USER",
    status: "ACTIVE",
  });

  await newUser.save();

  // Create Wallet for USER or AGENT
  if (newUser.role === "USER" || newUser.role === "AGENT") {
    const newWallet = new Wallet({
      owner: newUser._id,
      balance: 50,
      status: "ACTIVE",
    });

    await newWallet.save();
    newUser.wallet = new Types.ObjectId(newWallet._id);
    await newUser.save();
  }

  const userWithWallet = await User.findById(newUser._id).populate({
    path: "wallet",
    select: "balance status", // include more if needed
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
