import express, { Request, Response } from "express";
import { getDatabase } from "db/dbSetup";
import { DatabasePlace, PlaceDetails, PlaceId } from "./types";
import { verifyToken } from "routes/auth/middleware";

const router = express.Router();
const db = getDatabase();

interface QueryStringParams {
  placeId?: PlaceId;
}

router.get(
  "/details",
  verifyToken,
  async (req: Request<{}, {}, {}, QueryStringParams>, res: Response) => {
    const placeIdParam = req.query.placeId;

    if (!placeIdParam) {
      return res.status(401).json({ error: "No place ID provided" });
    }

    const placeId = placeIdParam.trim();

    try {
      const { rows: dbPlaces } = await db.query<DatabasePlace>(
        "SELECT * FROM places WHERE place_id = $1",
        [placeId]
      );

      if (dbPlaces.length === 0) {
        return res.status(404).json({ error: "Place not found" });
      }

      // Place exists, return the place details
      const dbPlace = dbPlaces[0];

      const placeDetails: PlaceDetails = {
        id: dbPlace.place_id,
        name: dbPlace.place_name,
        address: dbPlace.place_address,
        lat: dbPlace.latitude,
        lng: dbPlace.longitude,
        photoUrls: dbPlace.photo_urls,
      };

      return res.status(200).json(placeDetails);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
);

export default router;
