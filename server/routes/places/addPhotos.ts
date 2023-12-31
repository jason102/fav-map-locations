import express, { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { getDatabase } from "../../db/dbSetup";
import { PlaceId } from "./types";
import { UserTokenRequest, verifyToken } from "../auth/middleware";
import { awsS3Client } from "../../aws";

const MAX_ALLOWED_FILES_PER_UPLOAD = 5;

const router = express.Router();
const db = getDatabase();

const multerUploader = multer({
  storage: multerS3({
    s3: awsS3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME || "",
    acl: "private",
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB filesize limit
});

interface QueryStringParams {
  placeId?: PlaceId;
}

router.post(
  "/addPhotos",
  verifyToken,
  multerUploader.array("images", MAX_ALLOWED_FILES_PER_UPLOAD),
  async (req: Request<{}, {}, {}, QueryStringParams>, res: Response) => {
    const placeIdParam = req.query.placeId;

    if (!placeIdParam) {
      return res.status(401).json({ error: "No place ID provided" });
    }

    const placeId = placeIdParam.trim();

    if (!req.files) {
      return res.status(401).json({ error: "No photo files provided" });
    }

    const files = req.files as (Express.Multer.File & { key: string })[];

    // TODO: Use UserTokenRequest above instead of Request
    const userId = (req as UserTokenRequest).userToken!.userId;

    try {
      await db.query(
        "INSERT INTO photos (photo_file_key, place_id, user_id) VALUES " +
          files
            .map(
              (_, index) =>
                `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
            )
            .join(", "),
        files.flatMap((file) => [file.key, placeId, userId])
      );

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      // If there's an error, roll back the S3 uploads
      const deleteCommandPromises = files.map((file) =>
        awsS3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: file.key,
          })
        )
      );

      try {
        await Promise.all(deleteCommandPromises);
      } catch (deleteError) {
        return res
          .status(401)
          .json({ message: `Error deleting files from S3: ${deleteError}` });
      }

      return res.status(401).json({ message: error.message });
    }
  }
);

export default router;
