/* eslint-disable no-console */

import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { Wallet } from "../modules/wallet/wallet.model";
import { Types } from "mongoose";
import { wallletStatus } from "../modules/wallet/wallet.interface";
export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });
    if (isAdminExist) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const admin = await User.create({
      name: "Khaled Saifulla",
      role: "ADMIN",
      email: envVars.ADMIN_EMAIL,
      phone: envVars.ADMIN_PHONE,
      password: hashedPassword,
      status: "ACTIVE",
    } as IUser);

    const wallet = await Wallet.create({
      userId: admin._id,
      userName: admin.name,
      userEmail: admin.email,
      userPhone: admin.phone,
      userRole: admin.role,
      userStatus: admin.status,
      walletStatus: wallletStatus.ACTIVE,
      balance: 50000,
    });

    admin.wallet = new Types.ObjectId(wallet._id);
    await admin.save();

    console.log("Admin Created");
  } catch (error) {
    console.log(error);
  }
};
