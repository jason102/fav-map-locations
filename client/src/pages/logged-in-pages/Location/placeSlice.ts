import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Place } from "./types";
import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";
import { SerializableLatLng } from "src/app/api/types";

interface State {
  selectedPlace: Place | null;
  rightClickedPlace: Place | null;
  isLoading: boolean;
  swBoundsCoordinate: SerializableLatLng | null;
  neBoundsCoordinate: SerializableLatLng | null;
  selectedPlaceMovedOutOfView: boolean;
}

const initialState: State = {
  selectedPlace: null,
  rightClickedPlace: null,
  isLoading: false,
  swBoundsCoordinate: null,
  neBoundsCoordinate: null,
  selectedPlaceMovedOutOfView: false,
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    setSelectedPlace(state, { payload }: PayloadAction<Place | null>) {
      state.selectedPlace = payload;
    },
    clearSelectedPlace(state) {
      state.selectedPlace = null;
    },
    setBoundingBoxCoordinates(
      state,
      {
        payload: { sw, ne },
      }: PayloadAction<{
        sw: SerializableLatLng | null;
        ne: SerializableLatLng | null;
      }>
    ) {
      state.swBoundsCoordinate = sw;
      state.neBoundsCoordinate = ne;
    },
    setSelectedPlaceMovedOutOfView(state, { payload }: PayloadAction<boolean>) {
      state.selectedPlaceMovedOutOfView = payload;
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

const { reducer, actions } = placeSlice;

export const {
  setSelectedPlace,
  setSelectedPlaceMovedOutOfView,
  clearSelectedPlace,
  setBoundingBoxCoordinates,
} = actions;

export default reducer;
