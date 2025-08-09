import { IUser, UserRole, UserStatus } from "./user.interface";
import bcrypt from "bcryptjs";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError/AppError";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { Types } from "mongoose";
import { wallletStatus } from "../wallet/wallet.interface";
import { JwtPayload } from "jsonwebtoken";

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
      walletStatus: wallletStatus.ACTIVE,
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

// UPDATE A USER //
const changeAgentStatus = async (
  userId: string,
  status: UserStatus,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role !== UserRole.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only Admins can approve or suspend agents.",
      ""
    );
  }
  if (decodedToken.userId === userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admins cannot change their own status.",
      ""
    );
  }

  if (![UserStatus.ACTIVE, UserStatus.BLOCKED].includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid status value. Must be ACTIVE or BLOCKED.",
      ""
    );
  }
  const agent = await User.findById(userId).select("-password");
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found!", "");
  }
  if (agent.role !== UserRole.AGENT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This action can only be applied to agents.",
      ""
    );
  }
  agent.status = status;
  await agent.save();

  await Wallet.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { userStatus: status },
    { new: true }
  );

  return agent;
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
  changeAgentStatus,
  getUserById,
};
