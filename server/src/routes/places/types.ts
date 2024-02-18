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
