import { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import { User } from "./user.model";

// Create User //
export const createUser = async (userData: IUser) => {
  const hasedPassword = await bcrypt.hash(userData.password, 10);

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
