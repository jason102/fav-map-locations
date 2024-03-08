import React, { ChangeEvent, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch, useAppSelector } from "src/app/store";
import { useParams } from "react-router-dom";

import {
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import {
  compressImage,
  convertImageFilesToBase64Strings,
  resizeImage,
} from "./photoUtils";
import { useAddPlacePhotosMutation } from "src/app/api/photos";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { PlaceId } from "src/pages/logged-in-pages/Location/types";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";
import { Photo } from "./types";
import { UserToken } from "src/app/api/auth/types";

// Aligned with server/routes/places/addPhotos.ts
const MAX_ALLOWED_FILES_PER_UPLOAD = 5;
const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 5; // 5 MB

interface Params {
  setImages: React.Dispatch<React.SetStateAction<Photo[]>>;
}

export const useOnUploadPhoto = ({ setImages }: Params) => {
  const { placeId } = useParams();

  const dispatch = useAppDispatch();
  const { userId: currentUserId } = useAppSelector(
    (state) => state.auth.userToken
  ) as UserToken;

  const [isUploading, setIsUploading] = useState(false);

  const [dispatchAddPlacePhotos] = useSnackbarFetchResponse<
    {
      filesFormData: FormData;
      placeId: PlaceId;
    },
    string[]
  >(useAddPlacePhotosMutation());

  const onUploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      // This is most likely if the user clicks "Cancel" in the file dialog
      return;
    }

    if (selectedFiles.length > MAX_ALLOWED_FILES_PER_UPLOAD) {
      dispatch(
        openSnackbarWithFetchResult({
          message: "Up to 5 files may be uploaded at once.",
          type: FetchResultType.error,
        })
      );

      return;
    }

    // Convert from a FileList (IterableIterator) to a File array for easier processing
    const files = Array.from(selectedFiles);

    // Check the file sizes
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_IN_BYTES) {
        dispatch(
          openSnackbarWithFetchResult({
            message: "Each file must be less than 5 MB in size.",
            type: FetchResultType.error,
          })
        );

        return;
      }
    }

    setIsUploading(true);

    // Resize and compress the files before uploading
    const formData = new FormData();

    const resizeImagePromises = files.map((file) => resizeImage(file));

    try {
      const resizedImagesFiles = await Promise.all(resizeImagePromises);

      const compressImagePromises = resizedImagesFiles.map((file) =>
        compressImage(file)
      );

      const compressedImageFiles = await Promise.all(compressImagePromises);

      compressedImageFiles.forEach((file, index) =>
        formData.append(`images`, file, files[index].name)
      );
    } catch (error) {
      console.log("resizeImage() or compressImage(): ", error);

      dispatch(
        openSnackbarWithFetchResult({
          message: OOPS_MESSAGE,
          type: FetchResultType.error,
        })
      );

      setIsUploading(false);

      return;
    }

    // Upload the compressed photos
    const { isSuccess, data: fileKeys } = await dispatchAddPlacePhotos({
      filesFormData: formData,
      placeId: placeId || "",
    });

    if (!isSuccess) {
      setIsUploading(false);
      return;
    }

    // At this point, we can add the new images to the carousel component
    // We are storing the state of the images as base 64 strings
    const base64Files = await convertImageFilesToBase64Strings(formData);

    const newImages = base64Files.map<Photo>((file, index) => ({
      userId: currentUserId,
      fileKey: fileKeys ? fileKeys[index] : "",
      base64Image: file,
    }));

    setIsUploading(false);
    setImages((previousImages) => [...previousImages, ...newImages]);
  };

  return { onUploadPhoto, isUploading };
};
