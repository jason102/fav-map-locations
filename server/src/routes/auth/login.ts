import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getDatabase } from "db/dbSetup";
import { getSignedJwtTokens } from "utils/jwt";
import { validateLoginFields } from "./authFieldValidation";
import { DatabaseUser, LoginFormValues } from "./types";

const router = express.Router();
const db = getDatabase();

router.post(
  "/login",
  async (req: Request<{}, {}, LoginFormValues>, res: Response) => {
    const usernameOrEmail = req.body.usernameOrEmail.trim();
    const password = req.body.password.trim();

    // Field validation
    const errorMessage = validateLoginFields({ usernameOrEmail, password });

    if (errorMessage) {
      return res.status(401).json({ error: errorMessage });
    }

    try {
      // Try to get an existing user that matches the provided credentials
      const users = await db.query<DatabaseUser>(
        "SELECT * FROM users WHERE email = $1 OR username = $1",
        [usernameOrEmail]
      );

      if (users.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "Email or username is incorrect" });
      }

      // User exists, proceed to check if the password is correct
      const user = users.rows[0];

      const isValidPassword = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Incorrect password" });
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

      return res.status(200).location("/").json({ accessToken });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
);

export default router;
