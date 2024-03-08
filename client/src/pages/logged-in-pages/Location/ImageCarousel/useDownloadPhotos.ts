import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { ApiResponse, SuccessfulResponse } from "src/app/api/types";
import { useAppDispatch, useAppSelector } from "src/app/store";
import {
  FetchResult,
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";
import { Photo } from "./types";

// We shoudn't use RTK Query for downloading large files
// https://github.com/reduxjs/redux-toolkit/issues/1545
export const useDownloadPhotos = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { placeId } = useParams();

  const [images, setImages] = useState<Photo[]>([]);
  const [isFetchingImages, setIsFetchingImages] = useState(false);

  // React.StrictMode rerenders the app twice in dev mode
  const firstRender = useRef(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsFetchingImages(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/photos?placeId=${placeId}`,
          {
            credentials: "include",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // TODO: Check all fetch() calls and make sure response.ok is being checked
        const responseData: ApiResponse<Photo[]> = await response.json();

        if (responseData.error) {
          const fetchResult: FetchResult = {
            message: responseData.error,
            type: FetchResultType.error,
          };

          dispatch(openSnackbarWithFetchResult(fetchResult));
        } else {
          const { data: images } = responseData as SuccessfulResponse<Photo[]>;

          setImages(images);
        }
      } catch (error) {
        console.log("useDownloadPhotos() error: ", error);

        const fetchResult: FetchResult = {
          message: OOPS_MESSAGE,
          type: FetchResultType.error,
        };

        dispatch(openSnackbarWithFetchResult(fetchResult));
      } finally {
        setIsFetchingImages(false);
      }
    };

    if (firstRender.current && images.length === 0) {
      firstRender.current = false;
      fetchImages();
    }
  }, []);

  return { images, isFetchingImages, setImages };
};
