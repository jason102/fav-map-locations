import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getDatabase } from "../db/dbSetup";
import { getSignedJwtTokens } from "../utils/jwtHelpers";
import { DatabaseUser } from "../types";
import { PgErrorCodes } from "../db/utils";

const router = express.Router();
const db = getDatabase();

router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const users = await db.query<DatabaseUser>(
      "SELECT * FROM users WHERE email = $1 OR username = $1",
      [usernameOrEmail]
    );

    if (users.rowCount === 0) {
      return res.status(401).json({ error: "Email or username is incorrect" });
    }

    const user = users.rows[0];

    const isValidPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const { refreshToken, accessToken } = getSignedJwtTokens(user);

    res.cookie("refresh_token", refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).location("/").json({ accessToken });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const createdUsers = await db.query<DatabaseUser>(
      "INSERT INTO users (username, email, hashed_password, last_login) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [username, email, hashedPassword]
    );

    const newUser = createdUsers.rows[0];

    const { refreshToken, accessToken } = getSignedJwtTokens(newUser);

    res.cookie("refresh_token", refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res
      .status(201)
      .location("/")
      .json({ username: newUser.username, email: newUser.email, accessToken });
  } catch (error) {
    if (error.code === PgErrorCodes.duplicateRecord) {
      return res.status(409).json({ error: "User already exists" });
    }

    return res.status(401).json({ error: error.message });
  }
});

export default router;
