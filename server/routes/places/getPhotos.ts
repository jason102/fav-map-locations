import express, { Request, Response } from "express";
import { getDatabase } from "../../db/dbSetup";
import { DatabasePhoto, PlaceId } from "./types";
import { verifyToken } from "../auth/middleware";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { awsS3Client } from "../../aws";
import { Readable } from "stream";

const router = express.Router();
const db = getDatabase();

interface QueryStringParams {
  placeId?: PlaceId;
}

router.get(
  "/getPhotos",
  verifyToken,
  async (req: Request<{}, {}, {}, QueryStringParams>, res: Response) => {
    const placeIdParam = req.query.placeId;

    if (!placeIdParam) {
      return res.status(401).json({ error: "No place ID provided" });
    }

    const placeId = placeIdParam.trim();

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

      res.json(base64Images);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
);

export default router;
