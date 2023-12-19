import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Place } from "./types";
import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";
import { SerializableLatLng } from "src/app/api/types";

interface LocationState {
  selectedPlace: Place | null;
  rightClickedPlace: Place | null;
  isLoading: boolean;
  mapCenter: SerializableLatLng | null;
}

const initialState: LocationState = {
  selectedPlace: null,
  rightClickedPlace: null,
  isLoading: false,
  mapCenter: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedPlace(state, { payload }: PayloadAction<Place | null>) {
      state.selectedPlace = payload;
    },
    clearSelectedPlace(state) {
      state.selectedPlace = null;
    },
    setMapCenter(state, { payload }: PayloadAction<SerializableLatLng | null>) {
      state.mapCenter = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reverseGeocode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(reverseGeocode.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.rightClickedPlace = payload;
    });
    builder.addCase(reverseGeocode.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const { reducer, actions } = locationSlice;

export const { setSelectedPlace, clearSelectedPlace, setMapCenter } = actions;

export default reducer;
