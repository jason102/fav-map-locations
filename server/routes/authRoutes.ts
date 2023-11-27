import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getDatabase } from "../db/dbSetup";
import { getSignedJwtTokens } from "../utils/jwtHelpers";
import { DatabaseUser } from "../types";

const router = express.Router();
const db = getDatabase();

router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const users = await db.query<DatabaseUser>(
      "SELECT * FROM users WHERE email = $1 OR username = $1",
      [usernameOrEmail]
    );

    if (users.rows.length === 0) {
      return res.status(401).json({ error: "Email or username is incorrect" });
    }

    const user = users.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.user_password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const jwtTokens = getSignedJwtTokens(user);

    res.cookie("refresh_token", jwtTokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ jwtTokens });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
