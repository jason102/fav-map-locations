import express, { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { db } from "db/dbSetup";
import { DatabasePlaceDetails, PlaceDetails, PlaceId } from "./types";
import { UserTokenRequest, verifyToken } from "middleware/verifyToken";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";

const router = express.Router();

interface QueryParams {
  placeId: PlaceId;
}

router.get(
  "/details",
  verifyToken,
  queryHas("placeId", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { placeId } = matchedData(req) as QueryParams;

    // TODO: Use UserTokenRequest above instead of Request
    const userId = (req as UserTokenRequest).userToken!.userId;

    try {
      const { rows: dbPlaces } = await db.query<DatabasePlaceDetails>(
        `SELECT 
          pv.*,
          u.username AS creator_username,
          COALESCE(r.rating_value, 0) AS user_rating
         FROM 
           place_with_average_rating pv
         JOIN
           places p ON pv.place_id = p.place_id
         LEFT JOIN
           users u ON p.user_id = u.user_id
         LEFT JOIN 
           ratings r ON pv.place_id = r.place_id AND r.user_id = $1
         WHERE 
           pv.place_id = $2;
        `,
        [userId, placeId]
      );

      if (dbPlaces.length === 0) {
        return respondWith({
          res,
          status: 404,
          errorMessage: "Place not found",
        });
      }

      // Place exists, return the place details
      const {
        place_id,
        place_name,
        place_address,
        latitude,
        longitude,
        created_at,
        average_rating,
        user_rating,
        creator_username,
        user_id,
      } = dbPlaces[0];

      const placeDetails: PlaceDetails = {
        id: place_id,
        name: place_name,
        address: place_address,
        lat: latitude,
        lng: longitude,
        createdAt: created_at,
        averageRating: average_rating,
        userRating: user_rating,
        creatorUsername: creator_username,
        userId: user_id,
      };

      respondWith({ res, status: 200, data: placeDetails });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
