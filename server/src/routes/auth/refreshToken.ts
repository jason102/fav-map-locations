import express, { NextFunction, Request, Response } from "express";
import { matchedData, cookie, validationResult } from "express-validator";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { getSignedJwtTokens } from "utils/jwt";
import { respondWith } from "utils/responseHandling";

const router = express.Router();

interface Cookies {
  refresh_token: string;
}

router.get(
  "/refreshToken",
  cookie("refresh_token").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!validationResult(req).isEmpty()) {
      return respondWith({
        res,
        status: 401,
        errorMessage: "Login required",
      });
    }

    const { refresh_token: refreshToken } = matchedData(req) as Cookies;

    try {
      // Check if the existing refreshToken has expired or is invalid
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as Secret,
        // TODO: Fix TS errors
        (error, userToken) => {
          if (error) {
            console.error(error);
            return respondWith({
              res,
              status: 403,
              errorMessage: "Refresh token is invalid",
            });
          }

          // The existing refreshToken is still valid, so let's get
          // a new accessToken and refreshToken - Remove the old iat
          // and exp values in userToken so we can resign the same
          // information and get updated iat and exp timestamps
          const castUserToken = userToken as JwtPayload;
          const userInfoToSign = {
            userId: castUserToken.userId,
            username: castUserToken.username,
            email: castUserToken.email,
          };

          const { refreshToken, accessToken } =
            getSignedJwtTokens(userInfoToSign);

          // Set the updated refreshToken cookie and return the updated
          // accessToken to the frontend
          res.cookie("refresh_token", refreshToken, {
            ...(process.env.COOKIE_DOMAIN && {
              domain: process.env.COOKIE_DOMAIN,
            }),
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });

          respondWith({ res, status: 200, data: accessToken });
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

export default router;
