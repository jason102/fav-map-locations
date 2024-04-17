import { LatLng } from "leaflet";

export type UserDetails = {
  profileImage: string | null;
  memberSince: string;
};

export type SerializableLatLng = Pick<LatLng, "lat" | "lng">;

export type ErrorResponse = {
  data: null;
  error: string;
};

export type SuccessfulResponse<T> = {
  data: T;
  error: null;
};

export type ApiResponse<T> = SuccessfulResponse<T> | ErrorResponse;

export type SuccessMessageResponse = "success";

export type GraphQLPlace = {
  address: string;
  createdAt: string;
  creatorUserId: string;
  id: string;
  lat: number;
  lng: number;
  name: string;
};
