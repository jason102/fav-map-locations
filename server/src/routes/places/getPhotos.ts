import express, { NextFunction, Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { matchedData } from "express-validator";
import { getDatabase } from "db/dbSetup";
import { DatabasePhoto, PlaceId } from "./types";
import { verifyToken } from "middleware/verifyToken";
import { awsS3Client } from "aws";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";

const router = express.Router();
const db = getDatabase();

interface QueryParams {
  placeId: PlaceId;
}

router.get(
  "/getPhotos",
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
      const base64Images: string[] = [];

      for (const response of s3responses) {
        const chunks: Uint8Array[] = [];

        for await (const chunk of response.Body as Readable) {
          chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);
        const base64Image = buffer.toString("base64");
        base64Images.push(base64Image);
      }

      respondWith({ res, status: 200, data: base64Images });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
