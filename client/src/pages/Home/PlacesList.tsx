import React from "react";
import { useAppSelector } from "src/app/store";
import { useGetPlacesNearbyQuery } from "src/app/api";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import InfoIcon from "@mui/icons-material/Info";

const PlacesList: React.FC = () => {
  const mapCenter = useAppSelector((state) => state.location.mapCenter);
  const {
    data: places,
    isFetching,
    isUninitialized,
  } = useGetPlacesNearbyQuery(mapCenter!, { skip: !mapCenter });

  if (isFetching || isUninitialized || !places) {
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
            <Card key={place.id} sx={{ maxWidth: "90%", my: 1 }} elevation={6}>
              <CardActionArea>
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
