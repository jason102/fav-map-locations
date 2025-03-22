import { setSelectedPlace } from "src/pages/logged-in-pages/Location/placeSlice";
import api, { invalidateOn } from ".";
import {
  GraphQLPlace,
  SerializableLatLng,
  SuccessMessageResponse,
} from "./types";
import {
  Place,
  PlaceDetails,
  PlaceId,
  SubmittedAddPlaceData,
  SubmittedPlaceRating,
  SubmittedRemovePlaceData,
} from "src/pages/logged-in-pages/Location/types";

export const placesApi = api
  .enhanceEndpoints({
    addTagTypes: [
      "Places",
      "PlaceDetails",
      "PlaceDetailsGraphQL",
      "PlacesGraphQL",
    ],
  })
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
      getVisibleAreaPlacesGraphQL: builder.query<
        Place[],
        { ne: SerializableLatLng; sw: SerializableLatLng }
      >({
        query: ({ ne, sw }) => ({
          url: "graphql",
          method: "POST",
          body: {
            query: `
            query GetVisibleAreaPlaces(
              $neLat: Float!,
              $neLng: Float!,
              $swLat: Float!,
              $swLng: Float!
            ) {
              visibleAreaPlaces(bounds: {
                neLat: $neLat,
                neLng: $neLng,
                swLat: $swLat,
                swLng: $swLng
              }) {
                place {
                  id
                  name
                  address
                  lat
                  lng
                  createdAt
                  creatorUserId
                }
                averageRating
              }
            }
          `,
            variables: {
              neLat: ne.lat,
              neLng: ne.lng,
              swLat: sw.lat,
              swLng: sw.lng,
            },
          },
        }),
        transformResponse: (res) => {
          const response = res as any;

          if ("visibleAreaPlaces" in response) {
            const places = response.visibleAreaPlaces as {
              place: GraphQLPlace;
              averageRating: number;
            }[];

            // So this can be compatible with the existing REST API types and React code
            return places.map(({ place, averageRating }) => ({
              ...place,
              averageRating,
            }));
          }

          return response;
        },
        providesTags: ["PlacesGraphQL"],
      }),
      getPlaceDetails: builder.query<PlaceDetails, PlaceId>({
        query: (placeId) => ({
          url: "places/details",
          params: { placeId },
        }),
        providesTags: ["PlaceDetails"],
      }),
      getPlaceDetailsGraphQL: builder.query<PlaceDetails, PlaceId>({
        query: (placeId) => ({
          url: `graphql`,
          method: "POST",
          body: {
            query: `
            query GetPlaceDetails($id: ID!) {
              placeDetails(id: $id) {
                place {
                  id,
                  name,
                  address,
                  lat,
                  lng,
                  createdAt,
                  creatorUserId
                },
                userRating,
                creatorUsername,
                averageRating,
              }
            }
          `,
            variables: { id: placeId },
          },
        }),
        transformResponse: (res) => {
          const response = res as any;

          if ("placeDetails" in response) {
            const { place, averageRating, userRating, creatorUsername } =
              response.placeDetails;

            // So this can be compatible with the existing REST API types and React code
            return {
              ...place,
              averageRating,
              userRating,
              creatorUsername,
            };
          }

          return response;
        },
        providesTags: ["PlaceDetailsGraphQL"],
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
            success: [
              "PlaceDetails",
              "Places",
              "PlaceDetailsGraphQL",
              "PlacesGraphQL",
            ],
          }),
        }
      ),
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
        invalidatesTags: invalidateOn({ success: ["Places", "PlacesGraphQL"] }),
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
        invalidatesTags: invalidateOn({ success: ["Places", "PlacesGraphQL"] }),
      }),
    }),
  });

export const {
  useGetVisibleAreaPlacesQuery,
  useGetPlaceDetailsQuery,
  useFavoritePlaceMutation,
  useRemovePlaceMutation,
  useRatePlaceMutation,
  useGetPlaceDetailsGraphQLQuery,
  useGetVisibleAreaPlacesGraphQLQuery,
} = placesApi;
