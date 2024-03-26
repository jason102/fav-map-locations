import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import bcrypt from "bcrypt";
import { db } from "db/dbSetup";
import { getSignedJwtTokens } from "utils/jwt";
import { DatabaseUser } from "./types";
import { isDbDuplicateRecordError } from "db/utils";
import { respondWith } from "utils/responseHandling";
import { bodyHas, validateResult } from "middleware/validation";

const router = express.Router();

interface Body {
  username: string;
  email: string;
  password: string;
}

router.post(
  "/register",
  bodyHas("username"),
  bodyHas("email").isEmail().withMessage("Email is invalid"),
  bodyHas("password")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("Password is invalid"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = matchedData(req) as Body;

    // Hash the password and store the new user in the DB
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      const createdUsers = await db.query<DatabaseUser>(
        "INSERT INTO users (username, email, hashed_password, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
        [username, email, hashedPassword]
      );

      const newUser = createdUsers.rows[0];

      // Sign and return tokens
      const userInfoToSign = {
        userId: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
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

      respondWith({ res, status: 201, data: accessToken });
    } catch (error) {
      if (isDbDuplicateRecordError(error)) {
        return respondWith({
          res,
          status: 409,
          errorMessage: "User already exists",
        });
      }

      next(error);
    }
  }
);

export default router;
