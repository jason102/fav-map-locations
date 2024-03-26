import express, { NextFunction, Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { matchedData } from "express-validator";
import { UserTokenRequest, verifyToken } from "middleware/verifyToken";
import { db } from "db/dbSetup";
import { respondWith, SUCCESS_MESSAGE } from "utils/responseHandling";
import { awsS3Client } from "aws";
import { bodyHas, validateResult } from "middleware/validation";
import { DatabasePhoto } from "./types";

const router = express.Router();

interface Body {
  fileKey: string;
}

router.delete(
  "/deletePhoto",
  verifyToken,
  bodyHas("fileKey"),
  validateResult,
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileKey } = matchedData(req) as Body;

    const userId = (req as UserTokenRequest).userToken!.userId;

    try {
      // First make sure this user is allowed to delete the photo and that it even exists
      const { rows: dbPhotos } = await db.query<DatabasePhoto>(
        "SELECT * FROM photos WHERE photo_file_key = $1",
        [fileKey]
      );

      if (dbPhotos.length === 0) {
        return respondWith({
          res,
          status: 404,
          errorMessage: "Photo does not exist",
        });
      }

      if (dbPhotos[0].user_id !== userId) {
        return respondWith({
          res,
          status: 401,
          errorMessage: "Only photos uploaded by the same user can be deleted",
        });
      }

      // Then delete the photo from the DB - if this fails, then at least
      // we still have the photo in S3 and don't need to roll back anything
      await db.query<DatabasePhoto>(
        "DELETE FROM photos WHERE photo_file_key = $1",
        [fileKey]
      );

      // Delete the photo from S3 - if this fails, it's not that big of a deal
      // because the photo is already "forgotten" by the app after performing
      // the SQL above
      await awsS3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME || "",
          Key: fileKey,
        })
      );

      respondWith({ res, status: 200, data: SUCCESS_MESSAGE });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
