import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getGooglePlace from "src/pages/logged-in-pages/Location/getGooglePlaceThunk";
import { GooglePlace } from "./types";

interface LocationState {
  selectedGooglePlace: GooglePlace | null;
}

const initialState: LocationState = {
  selectedGooglePlace: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearSelectedGooglePlace(state) {
      state.selectedGooglePlace = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getGooglePlace.fulfilled,
      (state, { payload }: PayloadAction<GooglePlace>) => {
        state.selectedGooglePlace = payload;
      }
    );
  },
});

const { reducer, actions } = locationSlice;

export const { clearSelectedGooglePlace } = actions;

export default reducer;
