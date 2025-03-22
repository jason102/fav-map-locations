import express, { NextFunction, Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { matchedData } from "express-validator";
import { verifyToken } from "middleware/verifyToken";
import { db } from "db/dbSetup";
import { DatabasePlace, PlaceId } from "./types";
import { respondWith, SUCCESS_MESSAGE } from "utils/responseHandling";
import { awsS3Client } from "aws";
import { bodyHas, validateResult } from "middleware/validation";
import { DatabasePhoto } from "routes/photos/types";

const router = express.Router();

interface Body {
  placeId: PlaceId;
}

router.delete(
  "/remove",
  verifyToken,
  bodyHas("placeId", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { placeId } = matchedData(req) as Body;

    // First get all photos for the place in the DB
    try {
      // TODO: Add an index for the place_id column in the photos table?
      const { rows: dbPhotos } = await db.query<DatabasePhoto>(
        "SELECT * FROM photos WHERE place_id = $1",
        [placeId]
      );

      // Delete all the photos from S3
      const deleteCommandPromises = dbPhotos.map((photo) =>
        awsS3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: photo.photo_file_key,
          })
        )
      );

      // TODO: But what if there are many photos that must be deleted?
      await Promise.all(deleteCommandPromises);

      // Now we can safely delete the place from the DB tables (places, photos, ratings)
      await db.query<DatabasePlace>("DELETE FROM places WHERE place_id = $1", [
        placeId,
      ]);

      respondWith({ res, status: 200, data: SUCCESS_MESSAGE });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
