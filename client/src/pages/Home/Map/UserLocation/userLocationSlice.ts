import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableLatLng } from "src/app/api/types";

interface State {
  currentZoom: number;
  currentCenter: SerializableLatLng;
  userLocation: SerializableLatLng | null;
}

// Map starts zoomed out over North America
const initialState: State = {
  currentZoom: 4,
  currentCenter: { lat: 40.20376690670299, lng: -99.49598308788777 },
  userLocation: null,
};

const userLocationSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    setZoomAndCenterPoint(
      state,
      {
        payload: { zoom, centerPoint },
      }: PayloadAction<{ zoom: number; centerPoint: SerializableLatLng }>
    ) {
      state.currentZoom = zoom;
      state.currentCenter = centerPoint;
    },
    setUserLocation(state, { payload }: PayloadAction<SerializableLatLng>) {
      state.userLocation = payload;
    },
  },
});

const { actions, reducer } = userLocationSlice;

export const { setZoomAndCenterPoint, setUserLocation } = actions;

export default reducer;
