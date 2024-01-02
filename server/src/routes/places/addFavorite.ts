import express, { Request, Response } from "express";
import {
  verifyToken,
  verifyIsSameUser,
  UserTokenRequest,
} from "routes/auth/middleware";
import { getDatabase } from "db/dbSetup";
import { DatabasePlace, Place } from "./types";
import { PgErrorCodes } from "db/utils";

const router = express.Router();
const db = getDatabase();

router.post(
  "/addFavorite",
  verifyToken,
  verifyIsSameUser,
  async (req: Request<{}, {}, Place>, res: Response) => {
    const place: Place = {
      id: req.body.id,
      name: req.body.name.trim(),
      address: req.body.address.trim(),
      lat: req.body.lat,
      lng: req.body.lng,
    };

    // TODO: Use UserTokenRequest above instead of Request
    const userId = (req as UserTokenRequest).userToken!.userId;

    try {
      await db.query<DatabasePlace>(
        "INSERT INTO places (place_id, user_id, place_name, place_address, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6)",
        [place.id, userId, place.name, place.address, place.lat, place.lng]
      );

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      if (error.code === PgErrorCodes.duplicateRecord) {
        return res.status(409).json({ message: "Place already exists" });
      }

      return res.status(401).json({ message: error.message });
    }
  }
);

export default router;
