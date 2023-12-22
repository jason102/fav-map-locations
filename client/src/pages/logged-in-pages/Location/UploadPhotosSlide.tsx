import React, { useRef, ChangeEvent } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { useAddPlacePhotosMutation } from "src/app/api";

const UploadPhotosSlide: React.FC = () => {
  const [dispatchAddPlacePhotos] = useAddPlacePhotosMutation();

  const { placeId } = useParams();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onUploadFileCardClick = () => {
    fileInputRef.current!.click();
  };

  const onUploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      // This is most likely if the user clicks "Cancel" in the file dialog
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append(`images`, file);
    });

    const result = await dispatchAddPlacePhotos({
      filesFormData: formData,
      placeId: placeId || "",
    });

    console.log({ result });
  };

  return (
    <Box
      sx={{
        height: "400px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          height: "400px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card elevation={6}>
            <CardActionArea onClick={onUploadFileCardClick}>
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
              </CardContent>
            </CardActionArea>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg"
              hidden
              multiple
              onChange={onUploadPhoto}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadPhotosSlide;
