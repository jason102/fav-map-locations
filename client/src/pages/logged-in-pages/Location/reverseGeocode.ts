import { createAsyncThunk } from "@reduxjs/toolkit";
import { LatLng } from "leaflet";
import { OSMPlace, Place } from "./types";

const reverseGeocode = createAsyncThunk<Place, LatLng>(
  "location/osmPlace",
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      // https://nominatim.org/release-docs/develop/api/Reverse/
      const response =
        await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2
      `);

      const place: OSMPlace | { error: string } = await response.json();

      // Then the user right-clicked on some place out in the middle of nowhere without any data in Nominatim
      // so return a place where the address is the lat/lng coordinates
      if ("error" in place && place.error === "Unable to geocode") {
        return {
          id: Date.now().toString(),
          name: "",
          address: `Longitude: ${lng}, Latitude: ${lat}`,
          lat,
          lng,
          averageRating: 0,
        };
      }

      const {
        place_id: placeId,
        display_name: displayName,
        name,
      } = place as OSMPlace;

      const address =
        name && displayName.startsWith(name)
          ? displayName.substring(name.length + 1)
          : displayName;

      return {
        id: String(placeId),
        name,
        address,
        lat,
        lng,
        averageRating: 0,
      };
    } catch (error) {
      const e = String(error);
      return rejectWithValue(e);
    }
  }
);

export default reverseGeocode;
