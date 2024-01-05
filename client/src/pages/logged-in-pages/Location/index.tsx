import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "src/app/store";

import { clearSelectedPlace } from "src/pages/logged-in-pages/Location/locationSlice";
import { useGetPlaceDetailsQuery } from "src/app/api";
import ImageCarousel from "./ImageCarousel";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const Location: React.FC = () => {
  const dispatch = useAppDispatch();

  const { placeId } = useParams();

  const { data: placeDetails, isFetching } = useGetPlaceDetailsQuery(
    placeId ?? ""
  );

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
        dispatch(clearSelectedPlace());
      }

      firstRender.current = false;
    },
    []
  );

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" pt={15}>
        <CircularProgress size={30} color="inherit" />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth={false} disableGutters>
      <Typography variant="h6" textAlign="center" sx={{ py: 2 }}>
        {placeDetails!.name}
      </Typography>
      <ImageCarousel />
      <Container maxWidth="lg" sx={{ my: 4 }}>
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
