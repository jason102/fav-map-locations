import express, { Request, Response } from "express";
import { getDatabase } from "../../db/dbSetup";
import { DatabasePlace, Place } from "./types";

const router = express.Router();
const db = getDatabase();

interface RequestBody {
  lat: number;
  lng: number;
}

router.get(
  "/nearby",
  async (req: Request<{}, {}, RequestBody>, res: Response) => {
    const lat = req.body.lat;
    const lng = req.body.lng;

    try {
      const { rows: dbPlaces } = await db.query<DatabasePlace>(
        "SELECT * FROM places",
        []
      );

      const places = dbPlaces.map<Place>((place) => ({
        id: place.place_id,
        name: place.place_name,
        address: place.place_address,
        lat: place.latitude,
        lng: place.longitude,
      }));

      return res.status(200).json(places);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
);

export default router;
