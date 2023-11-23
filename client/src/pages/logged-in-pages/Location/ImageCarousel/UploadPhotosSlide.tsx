import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import SlideContainer from "./SlideContainer";

interface Props {
  isUploading: boolean;
  onCardClick: () => void;
}

const UploadPhotosSlide: React.FC<Props> = ({ isUploading, onCardClick }) => (
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
        <CardActionArea onClick={onCardClick}>
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
      </Card>
    )}
  </SlideContainer>
);

export default UploadPhotosSlide;
