import { JwtPayload } from "jsonwebtoken";

export type UserToken = JwtPayload & {
  userId: string;
};
