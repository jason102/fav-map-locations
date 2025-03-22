import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { db } from "db/dbSetup";
import { DatabasePlace, Place } from "./types";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";

const PLACES_QUERY_LIMIT = 20;

const router = express.Router();

interface QueryParams {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
}

router.get(
  "/",
  queryHas("neLat", { isNumber: true }),
  queryHas("neLng", { isNumber: true }),
  queryHas("swLat", { isNumber: true }),
  queryHas("swLng", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { neLat, neLng, swLat, swLng } = matchedData(req) as QueryParams;

    const boundsCenterLat = (neLat + swLat) / 2;
    const boundsCenterLng = (neLng + swLng) / 2;

    try {
      // Get places within the user's visible current bounding box rectangular area view of the map
      // First filter out places within the bounding box and then order them by the distance
      // from the center point of the view so places are somewhat evenly distributed and not all
      // clustered densely around the center point. Note that this basic mathematical approach is not
      // as accurate as using a professional geospatial extension like PostGIS, but is good enough
      // for the purposes of this app and demonstration. (Recommendation of ChatGPT)
      const { rows: dbPlaces } = await db.query<DatabasePlace>(
        `SELECT 
          p.*,
          ABS(p.latitude - $1) + ABS(p.longitude - $2) AS distance_from_center
         FROM 
          place_with_average_rating p
         WHERE 
          p.latitude BETWEEN $3 AND $4
          AND p.longitude BETWEEN $5 AND $6
         ORDER BY 
          distance_from_center
         LIMIT $7;`,
        [
          boundsCenterLat,
          boundsCenterLng,
          swLat,
          neLat,
          swLng,
          neLng,
          PLACES_QUERY_LIMIT,
        ]
      );

      // But since the center of map will always be changing as the user pans the map, to avoid
      // places shuffling around in the frontend PlacesList, let's sort them further
      // TODO: Can this instead be part of the SQL?
      const placesOrderedByAvgRating = [...dbPlaces].sort((a, b) => {
        // First order by rating (descending average rating)
        if (a.average_rating > b.average_rating) {
          return -1;
        } else if (a.average_rating < b.average_rating) {
          return 1;
        }

        // Then by place name in alphabetical order
        return a.place_name.localeCompare(b.place_name);
      });

      const places = placesOrderedByAvgRating.map<Place>((place) => ({
        id: place.place_id,
        name: place.place_name,
        address: place.place_address,
        lat: place.latitude,
        lng: place.longitude,
        averageRating: place.average_rating,
        userId: place.user_id,
      }));

      respondWith({ res, status: 200, data: places });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
