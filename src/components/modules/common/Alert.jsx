import { isValidElement,useRef } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert, clickConfirm } from '@modules/redux/reducers/alert';

// MUI
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  Stack,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Ant - Icons
import { CloseOutlined } from '@ant-design/icons';

// Mantis
import IconButton from '@components/@extended/IconButton';
import Draggable from 'react-draggable';

// react-draggable
function PaperComponent(props) {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef}
      handle="#draggable-alert-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{ x: 0, y: 0 }}
      bounds="parent"
    >
      <Paper ref={nodeRef} {...props} sx={{ transform: 'none' }} />
    </Draggable>
  );
}

// 컴포넌트 함수 선언.
const Alert = () => {
  // redux 상태 변경을 위한 dispatch.
  const dispatch = useDispatch();

  // modal에 대한 redux 상태 값 조회.
  const alert = useSelector((state) => state.alert);

  // 상태 값 구조 분해 할당.
  const { open, message, close, type } = alert;

  // 반응형 테마 설정.
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // 취소 버튼 클릭 이벤트.
  const handleClose = (event, reason) => {
    if (!close && reason === 'backdropClick') {
      return;
    }
    dispatch(closeAlert());
  };

  // 확인 버튼 클릭 이벤트.
  const handleOk = () => {
    dispatch(clickConfirm());
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
        id="draggable-alert-dialog-title"
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, cursor: 'move' }}
      >
        <Grid item>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              {type === 'info' && <InfoIcon />}
              {type === 'warn' && <WarningIcon color="warning" />}
              {type === 'error' && <ErrorIcon color="error" />}
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
      <DialogContent sx={{ whiteSpace: 'pre-line' }}>
        {isValidElement(message) ? (
          message
        ) : (
          <DialogContentText>
            {(message?.ref || typeof message === 'string') && message}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} autoFocus color="primary" variant="contained">
          확인
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

export default Alert;
