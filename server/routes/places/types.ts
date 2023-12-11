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
