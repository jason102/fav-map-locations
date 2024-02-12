import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import LoadingButton from "src/components/LoadingButton";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onConfirmButtonClick: () => void;
  title: string;
  contentText: string;
  yesNoOption?: boolean;
  onNoOptionClick?: () => void;
}

const LoadingDialog: React.FC<Props> = ({
  onConfirmButtonClick,
  isLoading,
  isOpen,
  title,
  contentText,
  yesNoOption,
  onNoOptionClick,
}) => (
  <Dialog
    open={isOpen}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {contentText}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {yesNoOption && (
        <Button onClick={onNoOptionClick} disabled={isLoading}>
          No
        </Button>
      )}
      <LoadingButton isLoading={isLoading} onClick={onConfirmButtonClick}>
        {yesNoOption ? "Yes" : "Ok"}
      </LoadingButton>
    </DialogActions>
  </Dialog>
);

export default LoadingDialog;
