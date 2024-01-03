import React, { useRef, ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "src/app/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import { useAddPlacePhotosMutation } from "src/app/api";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { PlaceId } from "./types";
import {
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import SlideContainer from "./SlideContainer";
import {
  compressImage,
  convertImageFilesToBase64Strings,
  resizeImage,
} from "./photoUtils";

// Aligned with server/routes/places/addPhotos.ts
const MAX_ALLOWED_FILES_PER_UPLOAD = 5;
const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 5; // 5 MB

interface Props {
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const UploadPhotosSlide: React.FC<Props> = ({ setImages }) => {
  const dispatch = useAppDispatch();

  const [isUploading, setIsUploading] = useState(false);

  const [dispatchAddPlacePhotos] = useSnackbarFetchResponse<{
    filesFormData: FormData;
    placeId: PlaceId;
  }>(useAddPlacePhotosMutation());

  const { placeId } = useParams();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
          message:
            "Oops, something went wrong! Please contact Jason to get it fixed!",
          type: FetchResultType.error,
        })
      );

      setIsUploading(false);

      return;
    }

    // Upload the compressed photos
    const fetchResult = await dispatchAddPlacePhotos({
      filesFormData: formData,
      placeId: placeId || "",
    });

    if (fetchResult.type !== FetchResultType.success) {
      dispatch(openSnackbarWithFetchResult(fetchResult));

      setIsUploading(false);

      return;
    }

    // At this point, we can add the new images to the carousel component
    // We are storing the state of the images as base 64 strings
    const base64Files = await convertImageFilesToBase64Strings(formData);

    setIsUploading(false);
    setImages((previousImages) => [...previousImages, ...base64Files]);
  };

  return (
    <SlideContainer>
      {isUploading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={30} color="inherit" />
        </Box>
      ) : (
        <Card elevation={6}>
          <CardActionArea onClick={() => fileInputRef.current!.click()}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pb: 2,
                }}
              >
                <AddAPhotoIcon
                  sx={{ width: 100, height: 100, color: "dodgerblue" }}
                />
              </Box>
              <Typography>Add photos for this place!</Typography>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
                hidden
                multiple
                onChange={onUploadPhoto}
              />
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </SlideContainer>
  );
};

export default UploadPhotosSlide;
