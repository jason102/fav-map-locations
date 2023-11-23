import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { respondWith } from "utils/responseHandling";

export interface UserTokenRequest extends Request {
  userToken?: JwtPayload & { userId: string };
}

// TODO: move these into the middleware folder
export const verifyToken = (
  req: UserTokenRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return respondWith({
      res,
      status: 401,
      errorMessage: "Authorization header must be provided",
    });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    (error, userToken) => {
      if (error) {
        console.error(error);
        return respondWith({
          res,
          status: 403,
          errorMessage: "Invalid access token",
        });
      }

      req.userToken = userToken as JwtPayload & { userId: string };

      next();
    }
  );
};
