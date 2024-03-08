import React, { useState } from "react";
import { Link as RRDLink } from "react-router-dom";

import { useRemovePlaceMutation } from "src/app/api/places";
import { useAppSelector } from "src/app/store";
import {
  Place,
  SubmittedRemovePlaceData,
} from "src/pages/logged-in-pages/Location/types";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { HttpResponseCodes } from "src/utils";
import { FetchResultType } from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import LoadingDialog from "src/components/LoadingDialog";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  place: Place;
}

const SavedPlacePopup: React.FC<Props> = ({ place }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.accessToken);
  const currentUserId = useAppSelector((state) => state.auth.userToken)?.userId;
  const swBoundsCoordinate = useAppSelector(
    (state) => state.place.swBoundsCoordinate
  );
  const neBoundsCoordinate = useAppSelector(
    (state) => state.place.neBoundsCoordinate
  );

  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  const [dispatchRemovePlace, { isLoading }] =
    useSnackbarFetchResponse<SubmittedRemovePlaceData>(
      useRemovePlaceMutation(),
      {
        [HttpResponseCodes.Success]: {
          message: "Place removed",
          type: FetchResultType.success,
        },
      }
    );

  const { id, name, address, userId } = place;

  const onDeletePlace = async () => {
    await dispatchRemovePlace({
      placeId: id,
      ne: neBoundsCoordinate!,
      sw: swBoundsCoordinate!,
    });
  };

  const isCreatedByCurrentUser = currentUserId === userId;

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Typography textAlign="center">
          <b>{name}</b>
        </Typography>
        <Typography variant="body2">{address}</Typography>
        {isLoggedIn ? (
          <Box display="flex" flexDirection="row">
            <Box
              display="flex"
              flex={1}
              justifyContent={isCreatedByCurrentUser ? "start" : "center"}
            >
              <Button component={RRDLink} to={`/location/${id}`}>
                Details
              </Button>
            </Box>
            {isCreatedByCurrentUser && (
              <IconButton onClick={() => setShowDeleteConfirmDialog(true)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ) : (
          <Button component={RRDLink} to={`login`}>
            Log in to view details!
          </Button>
        )}
      </Box>
      <LoadingDialog
        isOpen={showDeleteConfirmDialog}
        isLoading={isLoading}
        onConfirmButtonClick={onDeletePlace}
        title="Confirm Place Deletion"
        contentText="Are you sure you want to delete this place?"
        yesNoOption
        onNoOptionClick={() => setShowDeleteConfirmDialog(false)}
      />
    </>
  );
};

export default SavedPlacePopup;
