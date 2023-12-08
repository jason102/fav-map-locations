import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppSelector, useAppDispatch } from "src/app/store";
import { clearSelectedGooglePlace } from "src/pages/logged-in-pages/Location/locationSlice";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Location: React.FC = () => {
  const dispatch = useAppDispatch();
  const place = useAppSelector((state) => state.location.selectedGooglePlace);

  // React.StrictMode rerenders the app twice in dev mode
  const firstRender = useRef(true);

  // Reset the selected place to null when the user leaves this page so other places
  // can be loaded correctly for subsequent page loads
  useEffect(
    () => () => {
      if (
        (import.meta.env.DEV && !firstRender.current) ||
        import.meta.env.PROD
      ) {
        dispatch(clearSelectedGooglePlace());
      }

      firstRender.current = false;
    },
    []
  );

  return (
    <Container maxWidth={false} disableGutters>
      <Typography variant="h6" textAlign="center" sx={{ py: 2 }}>
        {place?.displayName.text}
      </Typography>
      <Slider dots infinite speed={500} autoplay centerMode>
        {place?.photos.map((photo, index) => (
          <Box
            key={index}
            component="img"
            src={photo.url}
            sx={{
              height: "400px",
              width: "auto",
              margin: "0 auto",
            }}
          />
        ))}
      </Slider>
      <Container component="main" maxWidth="lg" sx={{ my: 4 }}>
        <Box display="flex" flexDirection="row">
          <Box flex={1}>Average Rating</Box>
          <Box flex={1}>
            <Button>Save as Favorite Place</Button>
          </Box>
          <Box flex={1}>My Rating</Box>
        </Box>
      </Container>
    </Container>
  );
};

export default Location;
