import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { verifyToken, UserTokenRequest } from "middleware/verifyToken";
import { db } from "db/dbSetup";
import { DatabasePlace, Place, PlaceId } from "./types";
import { isDbDuplicateRecordError } from "db/utils";
import { SUCCESS_MESSAGE, respondWith } from "utils/responseHandling";
import { bodyHas, validateResult } from "middleware/validation";

const router = express.Router();

interface Body {
  id: PlaceId;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

router.post(
  "/addFavorite",
  verifyToken,
  bodyHas("id", { isNumber: true }),
  bodyHas("name"),
  bodyHas("address"),
  bodyHas("lat", { isNumber: true }),
  bodyHas("lng", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Use UserTokenRequest above instead of Request
    const userId = (req as UserTokenRequest).userToken!.userId;

    const place: Place = {
      ...(matchedData(req) as Body),
      averageRating: 0,
      userId,
    };

    try {
      await db.query<DatabasePlace>(
        "INSERT INTO places (place_id, user_id, place_name, place_address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6)",
        [place.id, userId, place.name, place.address, place.lat, place.lng]
      );

      respondWith({ res, status: 200, data: SUCCESS_MESSAGE });
    } catch (error) {
      if (isDbDuplicateRecordError(error)) {
        return respondWith({
          res,
          status: 409,
          errorMessage: "Place already exists",
        });
      }

      next(error);
    }
  }
);

export default router;
