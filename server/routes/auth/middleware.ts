import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface UserTokenRequst extends Request {
  userToken?: string | JwtPayload;
}

const verifyToken = (
  req: UserTokenRequst,
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

      req.userToken = userToken;

      next();
    }
  );
};

export default verifyToken;
