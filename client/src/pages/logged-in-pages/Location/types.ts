import { SerializableLatLng } from "src/app/api/types";

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
  averageRating: number;
  userId?: string; // Place is created from an OSMPlace when the user right-clicks the map, and the user may not yet be logged in, userId is optional
};

export type PlaceDetails = Place & {
  createdAt: Date;
  userRating: number;
  creatorUsername: string;
};

export type SubmittedPlaceRating = { rating: number; placeId: PlaceId };

export type SubmittedAddPlaceData = {
  place: Place;
  ne: SerializableLatLng;
  sw: SerializableLatLng;
};

export type SubmittedRemovePlaceData = {
  placeId: PlaceId;
  ne: SerializableLatLng;
  sw: SerializableLatLng;
};
