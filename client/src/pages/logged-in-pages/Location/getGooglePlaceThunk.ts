import { createAsyncThunk } from "@reduxjs/toolkit";
import { GooglePlaceResult, GooglePlace } from "./types";

export enum GoogleError {
  invalidPlace = "Not a valid Place ID",
}

const NUMBER_OF_PHOTOS = 1;

interface Props {
  placeId: string;
}

const getGooglePlace = createAsyncThunk<GooglePlace, Props>(
  "location/googlePlace",
  async ({ placeId }, { rejectWithValue }) => {
    try {
      // First get the general info of the Google Place
      const placeResponse = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`,
        {
          headers: {
            "X-Goog-FieldMask":
              "displayName,formattedAddress,photos,iconMaskBaseUri",
          },
        }
      );

      const placeResponseData: GooglePlaceResult = await placeResponse.json();

      // Check for errors
      if (placeResponseData.error) {
        const { status, message } = placeResponseData.error;

        if (
          status === "INVALID_ARGUMENT" &&
          message.includes(GoogleError.invalidPlace)
        ) {
          return rejectWithValue(GoogleError.invalidPlace);
        }

        return rejectWithValue(message);
      }

      if (!placeResponseData.photos) {
        // Then fetch up to NUMBER_OF_PHOTOS photo URLs, if the photos field exists
        placeResponseData.photos = [];
      }

      const photoFetchRequests = placeResponseData.photos.reduce<
        Promise<Response>[]
      >((accumulated, { name }, index) => {
        if (index < NUMBER_OF_PHOTOS) {
          return [
            ...accumulated,
            fetch(
              `https://places.googleapis.com/v1/${name}/media?key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }&maxHeightPx=400&maxWidthPx=600`
            ),
          ];
        }

        return accumulated;
      }, []);

      const photoResponses = await Promise.all(photoFetchRequests);

      // We only want the url field for each one
      const photos = photoResponses.map(({ url }) => url);

      // Add on the placeId, icon, and url to each photo instance in the general place info response data
      // to create a useful GooglePlace
      const googlePlace: GooglePlace = {
        ...placeResponseData,
        placeId,
        icon: `${placeResponseData.iconMaskBaseUri}.svg`,
        photos: placeResponseData.photos.map((photo, index) => ({
          ...photo,
          url: photos[index],
        })),
      };

      return googlePlace;
    } catch (error) {
      const e = String(error);
      return rejectWithValue(e);
    }
  }
);

export default getGooglePlace;
