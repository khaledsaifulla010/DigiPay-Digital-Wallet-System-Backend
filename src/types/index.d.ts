import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
      user: JwtPayload;
    }
  }
}
