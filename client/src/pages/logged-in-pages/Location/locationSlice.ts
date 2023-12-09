import { createSlice } from "@reduxjs/toolkit";
import { OSMPlace } from "./types";
import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";

interface LocationState {
  osmPlace: OSMPlace | null;
  isLoading: boolean;
}

const initialState: LocationState = {
  osmPlace: null,
  isLoading: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearSelectedOSMPlace(state) {
      state.osmPlace = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reverseGeocode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(reverseGeocode.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.osmPlace = payload;
    });
    builder.addCase(reverseGeocode.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const { reducer, actions } = locationSlice;

export const { clearSelectedOSMPlace } = actions;

export default reducer;
