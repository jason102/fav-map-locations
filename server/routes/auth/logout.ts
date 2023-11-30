import express, { Request, Response } from "express";
import { getDatabase } from "../../db/dbSetup";

const router = express.Router();
const db = getDatabase();

router.delete("/logout", async (req: Request, res: Response) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

export default router;
