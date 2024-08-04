// ConfirmDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContentText, DialogActions, Button, DialogContent } from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Annulla
      </Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Conferma
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
