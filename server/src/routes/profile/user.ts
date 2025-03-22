import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { DatabaseUser } from "routes/auth/types";
import { db } from "db/dbSetup";
import { verifyToken } from "middleware/verifyToken";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";

const router = express.Router();

interface QueryParams {
  username: string;
}

router.get(
  "/",
  verifyToken,
  queryHas("username"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = matchedData(req) as QueryParams;

    try {
      const users = await db.query<DatabaseUser>(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (users.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // User exists, return the needed info
      const user = users.rows[0];

      const userDetails = {
        profileImage: user.profile_image,
        memberSince: user.created_at,
      };

      respondWith({ res, status: 200, data: userDetails });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
