import express, { NextFunction, Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { matchedData } from "express-validator";
import { db } from "db/dbSetup";
import { DatabasePhoto, Photo } from "./types";
import { verifyToken } from "middleware/verifyToken";
import { awsS3Client } from "aws";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";
import { PlaceId } from "routes/places/types";

const router = express.Router();

interface QueryParams {
  placeId: PlaceId;
}

router.get(
  "/",
  verifyToken,
  queryHas("placeId", { isNumber: true }),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { placeId } = matchedData(req) as QueryParams;

    try {
      const { rows: dbPhotos } = await db.query<DatabasePhoto>(
        "SELECT * FROM photos WHERE place_id = $1",
        [placeId]
      );

      // Fetch all photo files from S3
      const getObjectCommands = dbPhotos.map((dbPhoto) =>
        awsS3Client.send(
          new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: dbPhoto.photo_file_key,
          })
        )
      );

      const s3responses = await Promise.all(getObjectCommands);

      // And convert them base64 encoded strings that can be parsed as JSON on the frontend
      const photos: Photo[] = [];

      // for (const response of s3responses) {
      for (let i = 0; i < s3responses.length; i++) {
        const chunks: Uint8Array[] = [];

        for await (const chunk of s3responses[i].Body as Readable) {
          chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);
        const base64Image = buffer.toString("base64");
        photos.push({
          base64Image: `data:image/jpeg;base64,${base64Image}`,
          fileKey: dbPhotos[i].photo_file_key,
          userId: dbPhotos[i].user_id,
        });
      }

      respondWith({ res, status: 200, data: photos });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
