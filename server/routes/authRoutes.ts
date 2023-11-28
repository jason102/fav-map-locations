import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getDatabase } from "../db/dbSetup";
import { getSignedJwtTokens } from "../utils/jwt";
import {
  validateLoginFields,
  validateRegistrationFields,
} from "./authFieldValidation";
import { DatabaseUser, LoginFormValues, RegisterFormValues } from "../types";
import { PgErrorCodes } from "../db/utils";

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
      const { refreshToken, accessToken } = getSignedJwtTokens(user);

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
      const { refreshToken, accessToken } = getSignedJwtTokens(newUser);

      res.cookie("refresh_token", refreshToken, {
        ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(201).location("/").json({
        username: newUser.username,
        email: newUser.email,
        accessToken,
      });
    } catch (error) {
      if (error.code === PgErrorCodes.duplicateRecord) {
        return res.status(409).json({ error: "User already exists" });
      }

      return res.status(401).json({ error: error.message });
    }
  }
);

export default router;
