import { useDispatch, useSelector } from 'react-redux';
import { closeCustomAlert, handleButtonsClick } from '@modules/redux/reducers/customAlert';
import { useTheme } from '@mui/styles';
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
import { isValidElement,useRef } from 'react';



// react-draggable
function PaperComponent(props) {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-custom-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{ x: 0, y: 0 }}
      bounds="parent"
    >
      <Paper ref={nodeRef} {...props} sx={{ transform: 'none' }} />
    </Draggable>
  );
}

const CustomModal = () => {
  const dispatch = useDispatch();

  const customModal = useSelector((state) => state.customAlert);
  const menuRoleList = useSelector((state) => state.menu.menuRoleList);

  const { open, close, width, title, content, buttons } = customModal;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = (event, reason) => {
    if (!close && reason === 'backdropClick') {
      return;
    }

    dispatch(closeCustomAlert());
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={!close}
      PaperComponent={PaperComponent}
      sx={{
        zIndex: 2005,
        '& .MuiPaper-root[role="dialog"]': {
          minWidth: width ? width : 'inherit',
          maxWidth: width ? width : 'inherit',
        },
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        id="draggable-custom-dialog-title"
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, cursor: 'move' }}
      >
        <Grid item>
          <DialogTitle>
            {isValidElement(title) ? (
              title
            ) : (
              <Stack direction="row" alignItems="center" spacing={1}>
                <InfoIcon />
                <Typography>
                  {' '}
                  {((title?.ref || typeof title === 'string') && title) || '정보처리 알림'}
                </Typography>
              </Stack>
            )}
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

      <DialogContent sx={{ whiteSpace: 'pre-line' }}>
        {isValidElement(content) ? (
          content
        ) : (
          <DialogContentText>
            {(content?.ref || typeof content === 'string') && content}
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions>
        {buttons?.map((option, index) => {
          let defaultRole;

          if (option.role === 'insert') defaultRole = '2';
          else if (option.role === 'update') defaultRole = '3';
          else if (option.role === 'delete') defaultRole = '4';

          const display = option.role && !menuRoleList.includes(defaultRole) && 'none';

          return (
            <Button
              key={`custom-alert-button-${index}`}
              type={option.type || 'button'}
              onClick={() => {
                if (option.callBack && typeof option.callBack === 'function') {
                  option.callBack();
                }

                if (!option.keepOpen) {
                  dispatch(handleButtonsClick());
                }
              }}
              variant={option.variant || 'contained'}
              color={option.color || 'primary'}
              size={option.size || 'small'}
              sx={{ display: display, ...option.sx }}
              form={option.type === 'submit' || option.type === 'reset' ? option?.form : null}
              autoFocus={option.autoFocus}
            >
              {option.label}
            </Button>
          );
        })}
        {close !== false && (
          <Button
            autoFocus={buttons?.reduce(
              (result, button) => (result ? (button.autoFocus ? false : true) : false),
              true,
            )}
            onClick={handleClose}
            color="secondary"
            variant="outlined"
          >
            취소
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
