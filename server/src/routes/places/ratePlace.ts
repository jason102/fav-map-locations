import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { verifyToken, UserTokenRequest } from "middleware/verifyToken";
import { db } from "db/dbSetup";
import { PlaceId } from "./types";
import { respondWith, SUCCESS_MESSAGE } from "utils/responseHandling";
import { bodyHas, validateResult } from "middleware/validation";

const router = express.Router();

interface Body {
  rating: number;
  placeId: PlaceId;
}

router.put(
  "/rate",
  verifyToken,
  bodyHas("rating", { isNumber: true }),
  bodyHas("placeId", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { rating, placeId } = matchedData(req) as Body;

    // TODO: Use UserTokenRequest above instead of Request
    const userId = (req as UserTokenRequest).userToken!.userId;

    try {
      await db.query(
        `INSERT INTO ratings (user_id, place_id, rating_value)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, place_id)
         DO UPDATE SET rating_value = EXCLUDED.rating_value;`,
        [userId, placeId, rating]
      );

      respondWith({ res, status: 200, data: SUCCESS_MESSAGE });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
