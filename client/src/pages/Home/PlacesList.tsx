import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "src/app/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import Rating from "@mui/material/Rating";

import {
  useGetVisibleAreaPlacesGraphQLQuery,
  // useGetVisibleAreaPlacesQuery,
} from "src/app/api/places";
import { Place } from "src/pages/logged-in-pages/Location/types";
import {
  setSelectedPlace,
  setSelectedPlaceMovedOutOfView,
} from "src/pages/logged-in-pages/Location/placeSlice";
import { useScrollToCard } from "./useScrollToCard";

const PlacesList: React.FC = () => {
  const dispatch = useAppDispatch();

  const selectedPlace = useAppSelector((state) => state.place.selectedPlace);
  const selectedPlaceMovedOutOfView = useAppSelector(
    (state) => state.place.selectedPlaceMovedOutOfView
  );

  const swBoundsCoordinate = useAppSelector(
    (state) => state.place.swBoundsCoordinate
  );
  const neBoundsCoordinate = useAppSelector(
    (state) => state.place.neBoundsCoordinate
  );

  // const { data: places, isError } = useGetVisibleAreaPlacesQuery(
  //   { ne: neBoundsCoordinate!, sw: swBoundsCoordinate! },
  //   {
  //     skip: !neBoundsCoordinate || !swBoundsCoordinate,
  //   }
  // );

  const { data: places, isError } = useGetVisibleAreaPlacesGraphQLQuery(
    { ne: neBoundsCoordinate!, sw: swBoundsCoordinate! },
    {
      skip: !neBoundsCoordinate || !swBoundsCoordinate,
    }
  );

  // Render the selectedPlace separately as a separate marker/popup and place list item and then
  // use this ref flag to indicate whether to filter the place out of the places array or not
  // Then the idea is that only when the user selects another place would this flag be reset to false
  useEffect(() => {
    if (
      selectedPlace &&
      !selectedPlaceMovedOutOfView &&
      places &&
      !places.find((nextPlace) => nextPlace.id === selectedPlace.id)
    ) {
      dispatch(setSelectedPlaceMovedOutOfView(true));
    }
  }, [places, selectedPlace]);

  const { cardRefs, selectedPlaceAtTopOfList } = useScrollToCard(places);

  const onPlaceClick = (place: Place) => {
    if (place.id !== selectedPlace?.id) {
      dispatch(setSelectedPlaceMovedOutOfView(false));
    }

    dispatch(setSelectedPlace(place));
  };

  const centerCardStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    pt: 1,
  };

  if (isError) {
    return (
      <Box sx={centerCardStyles}>
        <Card sx={{ maxWidth: "90%", my: 1 }} elevation={6}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <WarningIcon color="error" />
            <Typography pt={2}>
              {`Oh no! An error occurred and the places couldn't be loaded :( Please contact Jason to get it fixed!`}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!places) {
    return (
      <Box display="flex" justifyContent="center" pt={15}>
        <CircularProgress size={30} color="inherit" />
      </Box>
    );
  }

  const PlaceCards = () => {
    if (places.length === 0 && !selectedPlace && !selectedPlaceMovedOutOfView) {
      return (
        <Card sx={{ maxWidth: "90%", my: 1 }} elevation={6}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InfoIcon color="info" />
            <Typography pt={2}>
              This area doesn't have any favorited locations.
            </Typography>
            <Typography sx={{ pt: 2 }}>
              Move the map to see if favorited locations are elsewhere, or
              right-click or long-press anywhere on the map to favorite a new
              one!
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const SelectedPlaceCardContent = ({ place }: { place: Place }) => (
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {place.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {place.address}
        </Typography>
        <Rating
          value={place.averageRating}
          precision={0.5}
          size="small"
          readOnly
          sx={{ pt: 1 }}
        />
      </CardContent>
    );

    return (
      <>
        {selectedPlace && selectedPlaceMovedOutOfView && (
          <Card
            elevation={6}
            ref={selectedPlaceAtTopOfList}
            sx={{
              maxWidth: "90%",
              my: 1,
              backgroundColor: "gold",
            }}
          >
            <SelectedPlaceCardContent place={selectedPlace} />
          </Card>
        )}
        {places.reduce<JSX.Element[]>((accumulated, place) => {
          // Filter out the selected place that is now showing separately at the top of the list
          // (code immediately above this)
          if (selectedPlaceMovedOutOfView && place.id === selectedPlace?.id) {
            return accumulated;
          }

          return [
            ...accumulated,
            <Card
              key={place.id}
              ref={cardRefs[place.id]}
              elevation={6}
              sx={{
                maxWidth: "90%",
                minWidth: "90%",
                my: 1,
                backgroundColor:
                  place.id === selectedPlace?.id && !selectedPlaceMovedOutOfView
                    ? "gold"
                    : "inherit",
              }}
            >
              <CardActionArea onClick={() => onPlaceClick(place)}>
                <SelectedPlaceCardContent place={place} />
              </CardActionArea>
            </Card>,
          ];
        }, [])}
      </>
    );
  };

  return (
    <Box sx={centerCardStyles}>
      <PlaceCards />
    </Box>
  );
};

export default PlacesList;
