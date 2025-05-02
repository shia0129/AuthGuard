'use client'; // ✅ Ensures compatibility with Next.js 15

import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeConfirmAlert, handleConfirmClick } from '@modules/redux/reducers/confirmAlert';

import { useTheme } from '@mui/material/styles'; // ✅ Correct MUI v5 import
import { CloseOutlined } from '@ant-design/icons';
import InfoIcon from '@mui/icons-material/Info';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  Paper,
} from '@mui/material';
import Draggable from 'react-draggable';
import { isValidElement } from 'react';


// ✅ Ensure correct draggable Paper component
const PaperComponent = (props) => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef} handle="#draggable-confirm-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper  ref={nodeRef} {...props} />
    </Draggable>
  );
};

// ✅ Main ConfirmAlert Component
const ConfirmAlert = () => {
  const dispatch = useDispatch();
  const confirmAlert = useSelector((state) => state.confirmAlert);
  const { open, message, close, confirmButtonText, target } = confirmAlert;

  const theme = useTheme(); // ✅ Correct use of theme
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ Handle Close
  const handleClose = (event, reason) => {
    if (!close && reason === 'backdropClick') return;
    dispatch(closeConfirmAlert());
  };

  // ✅ Handle Confirm Click
  const handleConfirm = () => {
    dispatch(handleConfirmClick());
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={!close}
      PaperComponent={PaperComponent}
      sx={{ zIndex: 2005 }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
    >
      {/* ✅ Draggable Header */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        id="draggable-confirm-dialog-title"
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, cursor: 'move' }}
      >
        <Grid item>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoIcon />
              <Typography>정보처리 알림</Typography>
            </Stack>
          </DialogTitle>
        </Grid>
        <Grid item sx={{ mr: 1.5 }}>
          {close !== false && (
            <IconButton color="secondary" onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          )}
        </Grid>
      </Grid>

      {/* ✅ Dialog Content */}
      <DialogContent sx={{ whiteSpace: 'pre-line' }}>
        {isValidElement(message) ? (
          message
        ) : (
          <DialogContentText>
            {(message?.ref || typeof message === 'string') && message}
          </DialogContentText>
        )}
      </DialogContent>

      {/* ✅ Dialog Actions */}
      <DialogActions>
        <Button
          type="submit"
          form={target}
          onClick={handleConfirm} // ✅ Fixed typo
          autoFocus
          color="primary"
          variant="contained"
        >
          {confirmButtonText}
        </Button>
        {close !== false && (
          <Button onClick={handleClose} color="secondary" variant="outlined">
            취소
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAlert;
