import React, { ChangeEvent, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch, useAppSelector } from "src/app/store";
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
import {
  useAddPlacePhotosMutation,
  useDeletePhotoMutation,
} from "src/app/api/places";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { PlaceId } from "src/pages/logged-in-pages/Location/types";
import LoadingButton from "src/components/LoadingButton";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";
import { Photo } from "./types";
import { UserToken } from "src/app/api/auth/types";
import LoadingDialog from "src/components/LoadingDialog";
import { HttpResponseCodes } from "src/utils";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// Aligned with server/routes/places/addPhotos.ts
const MAX_ALLOWED_FILES_PER_UPLOAD = 5;
const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 5; // 5 MB

const ImageCarousel: React.FC = () => {
  const { placeId } = useParams();
  const dispatch = useAppDispatch();
  const { userId: currentUserId } = useAppSelector(
    (state) => state.auth.userToken
  ) as UserToken;

  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const fileKeyToDelete = useRef("");

  const { images, isFetchingImages, setImages } = useDownloadPhotos();
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dispatchAddPlacePhotos] = useSnackbarFetchResponse<
    {
      filesFormData: FormData;
      placeId: PlaceId;
    },
    string[]
  >(useAddPlacePhotosMutation());

  const [dispatchDeletePhoto, { isLoading: isDeletingPhoto }] =
    useSnackbarFetchResponse<{ fileKey: string }>(useDeletePhotoMutation(), {
      [HttpResponseCodes.Success]: {
        message: "Photo deleted",
        type: FetchResultType.success,
      },
    });

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

  const onUploadButtonClick = () => {
    fileInputRef.current!.click();
  };

  const onClickDeletePhoto = (fileKey: string) => {
    setShowDeleteConfirmDialog(true);
    fileKeyToDelete.current = fileKey;
  };

  const onDeletePhoto = async () => {
    await dispatchDeletePhoto({ fileKey: fileKeyToDelete.current });
    setShowDeleteConfirmDialog(false);

    const imagesWithoutDeletedOne = images.reduce<Photo[]>(
      (accumulated, nextImage) => {
        if (nextImage.fileKey === fileKeyToDelete.current) {
          return accumulated;
        }

        return [...accumulated, nextImage];
      },
      []
    );

    setImages(imagesWithoutDeletedOne);
  };

  // TODO: Make the slider show the pictures better?
  return (
    <>
      <Slider dots infinite speed={500} autoplay autoplaySpeed={5000}>
        {isFetchingImages && (
          <SlideContainer>
            <CircularProgress size={30} color="inherit" />
          </SlideContainer>
        )}
        {images.map(({ userId, base64Image, fileKey }, index) => {
          const isAddedByCurrentUser = currentUserId === userId;

          return (
            <SlideContainer key={index}>
              <Box
                key={index}
                component="img"
                src={base64Image}
                sx={{
                  height: "400px",
                }}
              />
              {isAddedByCurrentUser && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: "lightgray",
                    borderRadius: 6,
                  }}
                >
                  <IconButton onClick={() => onClickDeletePhoto(fileKey)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </SlideContainer>
          );
        })}
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
      <LoadingDialog
        isOpen={showDeleteConfirmDialog}
        isLoading={isDeletingPhoto}
        onConfirmButtonClick={onDeletePhoto}
        title="Confirm Photo Deletion"
        contentText="Are you sure you want to delete this photo?"
        yesNoOption
        onNoOptionClick={() => setShowDeleteConfirmDialog(false)}
      />
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
