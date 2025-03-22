import api from ".";
import { PlaceId } from "src/pages/logged-in-pages/Location/types";
import { SuccessMessageResponse } from "./types";

// Note that downloading photos should not be done via RTK Query because photos are large files
// that should not be cached. Therefore, I fetch them the old-fashioned way in
// client/src/pages/logged-in-pages/Location/ImageCarousel/useDownloadPhotos.ts
// Also see https://github.com/reduxjs/redux-toolkit/issues/1522
export const photosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addPlacePhotos: builder.mutation<
      string[],
      { filesFormData: FormData; placeId: PlaceId }
    >({
      query: ({ filesFormData, placeId }) => ({
        url: "photos/addPhotos",
        method: "POST",
        body: filesFormData,
        params: { placeId },
      }),
    }),
    deletePhoto: builder.mutation<SuccessMessageResponse, { fileKey: string }>({
      query: ({ fileKey }) => ({
        url: "photos/deletePhoto",
        method: "DELETE",
        body: { fileKey },
      }),
    }),
  }),
});

export const { useAddPlacePhotosMutation, useDeletePhotoMutation } = photosApi;
