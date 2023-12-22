import React from "react";
import { useAppSelector, useAppDispatch } from "src/app/store";
import { useGetPlacesNearbyQuery } from "src/app/api";
import { Place } from "src/pages/logged-in-pages/Location/types";
import { setSelectedPlace } from "src/pages/logged-in-pages/Location/locationSlice";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import InfoIcon from "@mui/icons-material/Info";
import { useScrollToCard } from "./useScrollToCard";

const PlacesList: React.FC = () => {
  const dispatch = useAppDispatch();

  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

  const mapCenter = useAppSelector((state) => state.location.mapCenter);
  const { data: places } = useGetPlacesNearbyQuery(mapCenter!, {
    skip: !mapCenter,
  });

  const cardRefs = useScrollToCard(places);

  const onPlaceClick = (place: Place) => {
    dispatch(setSelectedPlace(place));
  };

  if (!places) {
    return (
      <Box display="flex" justifyContent="center" pt={15}>
        <CircularProgress size={30} color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 1,
      }}
    >
      {places.length === 0 ? (
        <Card sx={{ maxWidth: "90%", m: 1 }} elevation={6}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InfoIcon color="info" />
            <Typography textAlign="center" pt={2}>
              Nobody has favorited any locations yet - be the first!
            </Typography>
            <Typography textAlign="center" sx={{ pt: 2 }}>
              Right-click or long-press anywhere on the map to favorite a
              location!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        places.map((place) => {
          return (
            <Card
              key={place.id}
              ref={cardRefs[place.id]}
              elevation={6}
              sx={{
                maxWidth: "90%",
                my: 1,
                backgroundColor:
                  place.id === selectedPlace?.id ? "gold" : "inherit",
              }}
            >
              <CardActionArea onClick={() => onPlaceClick(place)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {place.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {place.address}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default PlacesList;
