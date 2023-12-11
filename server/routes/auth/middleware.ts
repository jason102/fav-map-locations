import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface UserTokenRequest extends Request {
  userToken?: JwtPayload & { userId: string };
}

export const verifyToken = (
  req: UserTokenRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authorization header must be provided" });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    (error, userToken) => {
      if (error) {
        return res.status(403).json({ error: error.message });
      }

      req.userToken = userToken as JwtPayload & { userId: string };

      next();
    }
  );
};

export const verifyIsSameUser = (
  req: UserTokenRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["userid"];
  const userToken = req.userToken;

  if (!userToken) {
    return res
      .status(403)
      .json({ error: "Middleware requires the JWT userToken." });
  }

  if (userId !== userToken.userId) {
    return res
      .status(403)
      .json({ error: "User is unauthorized to perform this action." });
  }

  req.userToken!.userId = userId;

  next();
};
