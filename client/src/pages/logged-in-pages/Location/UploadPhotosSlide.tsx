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

    const formData = new FormData();

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE_IN_BYTES) {
        dispatch(
          openSnackbarWithFetchResult({
            message: "Each file must be less than 5 MB in size.",
            type: FetchResultType.error,
          })
        );

        return;
      }

      formData.append(`images`, file);
    }

    setIsUploading(true);

    const fetchResult = await dispatchAddPlacePhotos({
      filesFormData: formData,
      placeId: placeId || "",
    });

    if (fetchResult.type !== FetchResultType.success) {
      dispatch(openSnackbarWithFetchResult(fetchResult));

      return;
    }

    // At this point, we can add the new images to the carousel component
    // and the format they must be in are base 64 strings
    // https://stackoverflow.com/a/65586375
    const file2Base64 = (file: File): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = (error) => reject(error);
      });
    };

    const file2Base64Promises = Array.from(selectedFiles).map((file) =>
      file2Base64(file)
    );

    const base64Files = await Promise.all(file2Base64Promises);

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
