export type LocationLoaderData = {
  placeId: string;
};

export type OSMPlace = {
  place_id: number;
  name: string;
  display_name: string;
};

export type PlaceId = string;

export type Place = {
  id: PlaceId;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isFavorited: boolean;
};

export type PlaceDetails = Place & {
  photoUrls: string[];
  averageRating: number;
  userRating?: number;
};
