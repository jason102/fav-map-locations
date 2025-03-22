import React, { useEffect, useRef } from "react";
import { useParams, Link as RRDLink } from "react-router-dom";
import { useAppDispatch } from "src/app/store";
import { ChatProvider, AutoDraft } from "@chatscope/use-chat";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { clearSelectedPlace } from "src/pages/logged-in-pages/Location/placeSlice";
import {
  useGetPlaceDetailsGraphQLQuery,
  // useGetPlaceDetailsQuery,
  useRatePlaceMutation,
} from "src/app/api/places";
import ImageCarousel from "./ImageCarousel";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { SubmittedPlaceRating } from "./types";
import Chat from "./Chat";
import { useChatService } from "./Chat/useChatService";
import BreadCrumbs from "src/app/navigation/BreadCrumbs";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Link from "@mui/material/Link";

const Location: React.FC = () => {
  const dispatch = useAppDispatch();

  const { placeId } = useParams();

  // REST API
  // const { data: placeDetails, isLoading: isLoadingFirstTime } =
  //   useGetPlaceDetailsQuery(placeId ?? "");

  // GraphQL API
  const { data: placeDetails, isLoading: isLoadingFirstTime } =
    useGetPlaceDetailsGraphQLQuery(placeId ?? "");

  const [dispatchRatePlace] = useSnackbarFetchResponse<SubmittedPlaceRating>(
    useRatePlaceMutation()
  );

  const { showChat, chatStorage, chatServiceFactory } = useChatService();

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

  const onRate = async (_: React.SyntheticEvent, rating: number | null) => {
    if (rating && placeId) {
      await dispatchRatePlace({ rating, placeId });
    }
  };

  if (!placeDetails || isLoadingFirstTime) {
    return (
      <Box display="flex" justifyContent="center" pt={15}>
        <CircularProgress size={30} color="inherit" />
      </Box>
    );
  }

  const {
    name,
    averageRating,
    userRating,
    createdAt,
    creatorUsername,
    address,
  } = placeDetails;

  return (
    <Container component="main">
      <BreadCrumbs currentPage="Place Details" />
      <Typography variant="h6" textAlign="center" py={2}>
        {name}
      </Typography>
      <ImageCarousel />
      <Paper variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Box display="flex" flexDirection="row">
          <Box
            display="flex"
            flex={1}
            alignItems="start"
            flexDirection="column"
          >
            <Box>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="subtitle2" textAlign="center">
                Average Rating
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flex={1} alignItems="end" flexDirection="column">
            <Box>
              <Rating value={userRating} onChange={onRate} />
              <Typography variant="subtitle2" textAlign="center">
                My Rating
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="subtitle2" sx={{ pt: 2 }}>
          {`Favorited by `}
          <Link component={RRDLink} to={`../profile/${creatorUsername}`}>
            {creatorUsername}
          </Link>
          {` on ${new Date(createdAt).toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </Typography>
        <Typography sx={{ pt: 2 }}>
          <b>Address:</b>
          {` ${address}`}
        </Typography>
      </Paper>
      <Paper
        variant="elevation"
        elevation={8}
        sx={{ mt: 3, mb: 6, px: 3, pb: 3 }}
      >
        <Typography variant="h6" textAlign="center" sx={{ py: 2 }}>
          {`Place Discussion Chat Room`}
        </Typography>
        {showChat ? (
          <ChatProvider
            serviceFactory={chatServiceFactory}
            storage={chatStorage}
            config={{
              autoDraft: AutoDraft.Save | AutoDraft.Restore,
            }}
          >
            <Chat />
          </ChatProvider>
        ) : (
          <Box display="flex" justifyContent="center" pt={25} pb={42}>
            <CircularProgress size={30} color="inherit" />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Location;
