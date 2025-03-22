import express, { NextFunction, Request, Response } from "express";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { matchedData } from "express-validator";
import { db } from "db/dbSetup";
import { DatabasePhoto } from "./types";
import { UserTokenRequest, verifyToken } from "middleware/verifyToken";
import { awsS3Client } from "aws";
import { respondWith } from "utils/responseHandling";
import { queryHas, validateResult } from "middleware/validation";
import { PlaceId } from "routes/places/types";

// Aligned with client/src/pages/logged-in-pages/Location/ImageCarousel/index.tsx
const MAX_ALLOWED_FILES_PER_UPLOAD = 5;
const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 5; // 5 MB

const router = express.Router();

const multerUploader = multer({
  storage: multerS3({
    s3: awsS3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME || "",
    acl: "private",
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
});

interface QueryParams {
  placeId: PlaceId;
}

// TODO: Limit number of total photos allowed to be uploaded per place until pagination is implemented
router.post(
  "/addPhotos",
  verifyToken,
  queryHas("placeId", { isNumber: true }),
  validateResult,
  multerUploader.array("images", MAX_ALLOWED_FILES_PER_UPLOAD),
  async (req: Request, res: Response, next: NextFunction) => {
    const { placeId } = matchedData(req) as QueryParams;

    if (!req.files) {
      return respondWith({
        res,
        status: 422,
        errorMessage: "No photo files provided",
      });
    }

    const files = req.files as (Express.Multer.File & { key: string })[];

    // TODO: Use UserTokenRequest above instead of Request
    const userId = (req as UserTokenRequest).userToken!.userId;

    try {
      const { rows: dbPhotos } = await db.query<DatabasePhoto>(
        "INSERT INTO photos (photo_file_key, place_id, user_id) VALUES " +
          files
            .map(
              (_, index) =>
                `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
            )
            .join(", ") +
          " RETURNING *",
        files.flatMap((file) => [file.key, placeId, userId])
      );

      const fileKeys = dbPhotos.map((photo) => photo.photo_file_key);

      respondWith({ res, status: 200, data: fileKeys });
    } catch (error) {
      // If there's an error, roll back the S3 uploads
      const fileKeys = files.map((file) => ({ Key: file.key }));

      try {
        await awsS3Client.send(
          new DeleteObjectsCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Delete: {
              Objects: fileKeys,
            },
          })
        );
      } catch (deleteError) {
        console.error("Error deleting files from S3");
        return next(deleteError);
      }

      next(error);
    }
  }
);

export default router;
