import { PlaceId } from "routes/places/types";

export type DatabasePhoto = {
  photo_file_key: string;
  place_id: PlaceId;
  user_id: string;
  upload_timestamp: Date;
};

export type Photo = { fileKey: string; base64Image: string; userId: string };