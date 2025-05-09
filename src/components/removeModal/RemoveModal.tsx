import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface IRemoveModal {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  city: string;
}

export const RemoveModal: React.FC<IRemoveModal> = ({
  open,
  onClose,
  onConfirm,
  city,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Removing</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove <strong>{city}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
