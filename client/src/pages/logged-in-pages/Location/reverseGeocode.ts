import { createAsyncThunk } from "@reduxjs/toolkit";
import { LatLng } from "leaflet";
import { OSMPlace } from "./types";

const reverseGeocode = createAsyncThunk<OSMPlace, LatLng>(
  "location/osmPlace",
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response =
        await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2
      `);

      const place: OSMPlace = await response.json();

      return place;
    } catch (error) {
      const e = String(error);
      return rejectWithValue(e);
    }
  }
);

export default reverseGeocode;
