import { LatLng } from "leaflet";

export type UserDetails = {
  profileImage: string | null;
  memberSince: string;
};

export type SerializableLatLng = Pick<LatLng, "lat" | "lng">;
