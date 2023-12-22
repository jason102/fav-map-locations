export type PlaceId = string;

export type Place = {
  id: PlaceId;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type DatabasePlace = {
  place_id: string;
  user_id: string;
  place_name: string;
  place_address: string;
  latitude: number;
  longitude: number;
  photo_urls: string[];
  created_at: Date;
};

export type PlaceDetails = Place & {
  photoUrls: string[];
};

export type DatabasePhoto = {
  photo_file_key: string;
  place_id: PlaceId;
  user_id: string;
  upload_timestamp: Date;
};
