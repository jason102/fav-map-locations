import express, { Request, Response } from "express";
import { DatabaseUser } from "../../types";
import { getDatabase } from "../../db/dbSetup";
import verifyToken from "../auth/middleware";

const router = express.Router();
const db = getDatabase();

router.get(
  "/",
  verifyToken,
  async (req: Request<{}, {}, {}, { username?: string }>, res: Response) => {
    const usernameParam = req.query.username;

    if (!usernameParam) {
      return res.status(401).json({ error: "No username provided" });
    }

    const username = usernameParam.trim();

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

      return res.status(200).json({ userDetails });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
);

export default router;
