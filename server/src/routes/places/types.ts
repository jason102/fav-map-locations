export type PlaceId = string;

export type Place = {
  id: PlaceId;
  name: string;
  address: string;
  lat: number;
  lng: number;
  averageRating: number;
  userId?: string;
};

export type DatabasePlace = {
  place_id: string;
  user_id: string;
  place_name: string;
  place_address: string;
  latitude: number;
  longitude: number;
  created_at: Date;
  average_rating: number;
};

export type DatabasePlaceDetails = DatabasePlace & {
  user_rating: number;
  creator_username: string;
};

export type PlaceDetails = Place & {
  createdAt: Date;
  userRating: number;
  creatorUsername: string;
};

export type DatabasePhoto = {
  photo_file_key: string;
  place_id: PlaceId;
  user_id: string;
  upload_timestamp: Date;
};

export type Photo = { fileKey: string; base64Image: string; userId: string };
