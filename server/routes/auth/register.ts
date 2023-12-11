import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getDatabase } from "../../db/dbSetup";
import { getSignedJwtTokens } from "../../utils/jwt";
import { validateRegistrationFields } from "./authFieldValidation";
import { DatabaseUser, RegisterFormValues } from "./types";
import { PgErrorCodes } from "../../db/utils";

const router = express.Router();
const db = getDatabase();

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterFormValues>, res: Response) => {
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    // Field validation
    const errorMessage = validateRegistrationFields({
      username,
      email,
      password,
    });

    if (errorMessage) {
      return res.status(401).json({ error: errorMessage });
    }

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
        ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(201).location("/").json({ accessToken });
    } catch (error) {
      if (error.code === PgErrorCodes.duplicateRecord) {
        return res.status(409).json({ error: "User already exists" });
      }

      return res.status(401).json({ error: error.message });
    }
  }
);

export default router;
