import React, { ChangeEvent, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch } from "src/app/store";
import { useParams } from "react-router-dom";

import UploadPhotosSlide from "./UploadPhotosSlide";
import SlideContainer from "./SlideContainer";
import { useDownloadPhotos } from "./useDownloadPhotos";
import {
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import {
  compressImage,
  convertImageFilesToBase64Strings,
  resizeImage,
} from "./photoUtils";
import { useAddPlacePhotosMutation } from "src/app/api/places";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { PlaceId } from "src/pages/logged-in-pages/Location/types";
import LoadingButton from "src/components/LoadingButton";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

// Aligned with server/routes/places/addPhotos.ts
const MAX_ALLOWED_FILES_PER_UPLOAD = 5;
const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 5; // 5 MB

const ImageCarousel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { placeId } = useParams();

  const { images, isFetchingImages, setImages } = useDownloadPhotos();
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dispatchAddPlacePhotos] = useSnackbarFetchResponse<{
    filesFormData: FormData;
    placeId: PlaceId;
  }>(useAddPlacePhotosMutation());

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
    const { isSuccess } = await dispatchAddPlacePhotos({
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

    setIsUploading(false);
    setImages((previousImages) => [...previousImages, ...base64Files]);
  };

  const onUploadButtonClick = () => {
    fileInputRef.current!.click();
  };

  return (
    <>
      <Slider dots infinite speed={500} autoplay autoplaySpeed={5000}>
        {isFetchingImages && (
          <SlideContainer>
            <CircularProgress size={30} color="inherit" />
          </SlideContainer>
        )}
        {images.map((photo, index) => (
          <SlideContainer key={index}>
            <Box
              key={index}
              component="img"
              src={photo}
              sx={{
                height: "400px",
              }}
            />
          </SlideContainer>
        ))}
        {images.length === 0 && (
          <UploadPhotosSlide
            isUploading={isUploading}
            onCardClick={onUploadButtonClick}
          />
        )}
      </Slider>
      {images.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
          <LoadingButton
            variant="contained"
            onClick={onUploadButtonClick}
            isLoading={isUploading}
          >
            Add photos
            <AddAPhotoIcon sx={{ color: "white", ml: 1 }} />
          </LoadingButton>
        </Box>
      )}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg"
        hidden
        multiple
        onChange={onUploadPhoto}
      />
    </>
  );
};

export default ImageCarousel;
