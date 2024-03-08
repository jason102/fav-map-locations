import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppSelector } from "src/app/store";

import UploadPhotosSlide from "./UploadPhotosSlide";
import SlideContainer from "./SlideContainer";
import { useDownloadPhotos } from "./useDownloadPhotos";
import { FetchResultType } from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { useDeletePhotoMutation } from "src/app/api/photos";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import LoadingButton from "src/components/LoadingButton";
import { Photo } from "./types";
import { UserToken } from "src/app/api/auth/types";
import LoadingDialog from "src/components/LoadingDialog";
import { HttpResponseCodes } from "src/utils";
import { useOnUploadPhoto } from "./useOnUploadPhoto";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageCarousel: React.FC = () => {
  const { userId: currentUserId } = useAppSelector(
    (state) => state.auth.userToken
  ) as UserToken;

  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const fileKeyToDelete = useRef("");

  const { images, isFetchingImages, setImages } = useDownloadPhotos();
  const { onUploadPhoto, isUploading } = useOnUploadPhoto({ setImages });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dispatchDeletePhoto, { isLoading: isDeletingPhoto }] =
    useSnackbarFetchResponse<{ fileKey: string }>(useDeletePhotoMutation(), {
      [HttpResponseCodes.Success]: {
        message: "Photo deleted",
        type: FetchResultType.success,
      },
    });

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
  // TODO: While the photos are loading, it shows two dots at the bottom for two slides, need to fix this
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
