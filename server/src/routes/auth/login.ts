import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { matchedData } from "express-validator";
import { db } from "db/dbSetup";
import { getSignedJwtTokens } from "utils/jwt";
import { DatabaseUser } from "./types";
import { respondWith } from "utils/responseHandling";
import { bodyHas, validateResult } from "middleware/validation";

const router = express.Router();

interface Body {
  usernameOrEmail: string;
  password: string;
}

router.post(
  "/login",
  bodyHas("usernameOrEmail"),
  bodyHas("password"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { usernameOrEmail, password } = matchedData(req) as Body;

    try {
      // Try to get an existing user that matches the provided credentials
      const users = await db.query<DatabaseUser>(
        "SELECT * FROM users WHERE email = $1 OR username = $1",
        [usernameOrEmail]
      );

      if (users.rowCount === 0) {
        return respondWith({
          res,
          status: 401,
          errorMessage: "Email or username is incorrect",
        });
      }

      // User exists, proceed to check if the password is correct
      const user = users.rows[0];

      const isValidPassword = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (!isValidPassword) {
        return respondWith({
          res,
          status: 401,
          errorMessage: "Incorrect password",
        });
      }

      // Provided login info is valid, proceed to update the last_login timestamp
      await db.query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1",
        [user.user_id]
      );

      // Sign and return tokens
      const userInfoToSign = {
        userId: user.user_id,
        username: user.username,
        email: user.email,
      };

      const { refreshToken, accessToken } = getSignedJwtTokens(userInfoToSign);

      res.cookie("refresh_token", refreshToken, {
        ...(process.env.COOKIE_DOMAIN && {
          domain: process.env.COOKIE_DOMAIN,
        }),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      respondWith({ res, status: 200, data: accessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
