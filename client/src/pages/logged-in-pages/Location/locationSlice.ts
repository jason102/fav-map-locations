import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Place } from "./types";
import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";

interface LocationState {
  selectedPlace: Place | null;
  isLoading: boolean;
}

const initialState: LocationState = {
  selectedPlace: null,
  isLoading: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedPlace(state, { payload }: PayloadAction<Place>) {
      state.selectedPlace = payload;
    },
    clearSelectedPlace(state) {
      state.selectedPlace = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reverseGeocode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(reverseGeocode.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.selectedPlace = payload;
    });
    builder.addCase(reverseGeocode.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const { reducer, actions } = locationSlice;

export const { setSelectedPlace, clearSelectedPlace } = actions;

export default reducer;
