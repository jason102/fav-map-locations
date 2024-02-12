import { setSelectedPlace } from "src/pages/logged-in-pages/Location/placeSlice";
import api, { invalidateOn } from ".";
import { SerializableLatLng, SuccessMessageResponse } from "./types";
import {
  Place,
  PlaceDetails,
  PlaceId,
  SubmittedAddPlaceData,
  SubmittedPlaceRating,
  SubmittedRemovePlaceData,
} from "src/pages/logged-in-pages/Location/types";

// TODO: Move photo endpoints into own set of endpoints
export const placesApi = api
  .enhanceEndpoints({ addTagTypes: ["Places", "PlaceDetails"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getVisibleAreaPlaces: builder.query<
        Place[],
        { ne: SerializableLatLng; sw: SerializableLatLng }
      >({
        query: ({ ne, sw }) => ({
          url: "places",
          params: {
            neLat: ne.lat,
            neLng: ne.lng,
            swLat: sw.lat,
            swLng: sw.lng,
          },
        }),
        providesTags: ["Places"],
      }),
      getPlaceDetails: builder.query<PlaceDetails, PlaceId>({
        query: (placeId) => ({
          url: "places/details",
          params: { placeId },
        }),
        providesTags: ["PlaceDetails"],
      }),
      ratePlace: builder.mutation<SuccessMessageResponse, SubmittedPlaceRating>(
        {
          query: (ratingAndPlaceId) => ({
            url: "places/rate",
            method: "PUT",
            body: ratingAndPlaceId,
          }),
          // Optimistic update: Immediately show the rating the user selected coming from the getPlaceDetails endpoint
          onQueryStarted: (placeRating, { dispatch, queryFulfilled }) => {
            const dispatchResult = dispatch(
              placesApi.util.updateQueryData(
                "getPlaceDetails",
                placeRating.placeId,
                (draft) => {
                  draft.userRating = placeRating.rating;
                }
              )
            );

            queryFulfilled.catch(dispatchResult.undo);
          },
          invalidatesTags: invalidateOn({
            success: ["PlaceDetails", "Places"],
          }),
        }
      ),
      addPlacePhotos: builder.mutation<
        string[],
        { filesFormData: FormData; placeId: PlaceId }
      >({
        query: ({ filesFormData, placeId }) => ({
          url: "places/addPhotos",
          method: "POST",
          body: filesFormData,
          params: { placeId },
        }),
      }),
      favoritePlace: builder.mutation<
        SuccessMessageResponse,
        SubmittedAddPlaceData
      >({
        query: ({ place }) => ({
          url: "places/addFavorite",
          method: "POST",
          body: place,
        }),
        // Optimistic update: Immediately show the favorited place in the list of favorited places shown on the map
        onQueryStarted: ({ place, ne, sw }, { dispatch, queryFulfilled }) => {
          const dispatchResult = dispatch(
            placesApi.util.updateQueryData(
              "getVisibleAreaPlaces",
              { ne, sw },
              (placesArrayDraft) => {
                placesArrayDraft.push({ ...place, averageRating: 0 });
              }
            )
          );

          queryFulfilled.catch(dispatchResult.undo);
        },
        invalidatesTags: invalidateOn({ success: ["Places"] }),
      }),
      removePlace: builder.mutation<
        SuccessMessageResponse,
        SubmittedRemovePlaceData
      >({
        query: ({ placeId }) => ({
          url: "places/remove",
          method: "DELETE",
          body: { placeId },
        }),
        // Optimistic update: Remove the place from the favorited list of places immediately and deselect it
        onQueryStarted: ({ placeId, ne, sw }, { dispatch, queryFulfilled }) => {
          const removeFromListDispatchResult = dispatch(
            placesApi.util.updateQueryData(
              "getVisibleAreaPlaces",
              { ne, sw },
              (placesArrayDraft) => {
                const placeToRemoveIndex = placesArrayDraft.findIndex(
                  (place) => place.id === placeId
                );

                placesArrayDraft.splice(placeToRemoveIndex, 1);
              }
            )
          );
          queryFulfilled.catch(removeFromListDispatchResult.undo);

          dispatch(setSelectedPlace(null));
        },
        invalidatesTags: invalidateOn({ success: ["Places"] }),
      }),
      deletePhoto: builder.mutation<
        SuccessMessageResponse,
        { fileKey: string }
      >({
        query: ({ fileKey }) => ({
          url: "places/deletePhoto",
          method: "DELETE",
          body: { fileKey },
        }),
      }),
    }),
  });

export const {
  useGetVisibleAreaPlacesQuery,
  useGetPlaceDetailsQuery,
  useFavoritePlaceMutation,
  useRemovePlaceMutation,
  useAddPlacePhotosMutation,
  useRatePlaceMutation,
  useDeletePhotoMutation,
} = placesApi;
