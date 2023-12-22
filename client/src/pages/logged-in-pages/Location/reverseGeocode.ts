import { createAsyncThunk } from "@reduxjs/toolkit";
import { LatLng } from "leaflet";
import { OSMPlace, Place } from "./types";

const reverseGeocode = createAsyncThunk<Place, LatLng>(
  "location/osmPlace",
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response =
        await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2
      `);

      const place: OSMPlace = await response.json();

      const { place_id: placeId, display_name: displayName, name } = place;

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
        isFavorited: false,
      };
    } catch (error) {
      const e = String(error);
      return rejectWithValue(e);
    }
  }
);

export default reverseGeocode;
