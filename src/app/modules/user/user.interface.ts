export type UserRole = "USER" | "AGENT" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
}
