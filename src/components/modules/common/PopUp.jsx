// MUI
import InfoIcon from '@mui/icons-material/Info';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  Stack,
  Typography,
  Grid,
  Paper,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Ant - Icons
import { CloseOutlined } from '@ant-design/icons';

// Mantis
import IconButton from '@components/@extended/IconButton';

// third-party
import Draggable from 'react-draggable';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { useRef } from 'react';

function PaperComponent(props) {
  const nodeRef  = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{ x: 0, y: 0 }}
      bounds="parent"
    >
      <Paper ref={nodeRef} {...props} sx={{ transform: 'none' }} /> 
    </Draggable>
  );
}

/**
 *
 * @param {String} title 팝업 제목.
 * @param {Boolean} alertOpen 팝업 오픈 여부 상태.
 * @param {Function} closeAlert 팝업 오픈 상태 변경 함수.
 * @param {Function} callBack 확인버튼 클릭 이벤트 함수.
 * @param {Boolean} disableCancel 취소 버튼 숨김 플래그.
 * @param {Boolean} disableConfirm  확인 버튼 숨김 플래그.
 * @param {*} actionComponent 확인 취소 라인의 가장 왼쪽부터 추가할 수 있는 컴포넌트.
 * @param {String || Boolean} maxWidth 팝업 최대 크기. (breakPoint, ex. sm, md, lg... / false)
 * @param {Boolean} fullWidth maxWidth 크기만큼 팝업 사이즈 키우키 여부.
 * @param {String} cancelLabel 취소 버튼 라벨.
 * @param {String} confirmLabel 확인 버튼 라벨.
 * @param {String} tooltipMessage 타이틀 아이콘에 마우스 오버 시 표시할 도움말 메시지.
 */
const PopUp = ({
  title,
  alertOpen = false,
  closeAlert,
  callBack,
  children,
  disableCancel,
  disableConfirm,
  actionComponent,
  maxWidth = false,
  fullWidth = false,
  cancelLabel,
  confirmLabel,
  tooltipMessage,
  ...rest
}) => {
  const methods = useFormContext();

  // 반응형 테마 설정.
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // 취소 버튼 클릭 이벤트.
  const handleClose = (e, reason) => {
    if (reason === 'backdropClick') return;

    closeAlert(false);
  };

  // 확인 버튼 클릭 이벤트.
  const handleOk = async () => {
    if (methods && !isEmpty(methods.formState.errors)) return;
    if (callBack) {
      let isDone = callBack();
      if (isDone instanceof Promise) {
        isDone = await isDone;
      }
      if (isDone) handleClose();
    } else handleClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={alertOpen}
      onClose={handleClose}
      fullWidth={fullWidth}
      PaperComponent={PaperComponent}
      maxWidth={maxWidth}
      {...rest}
    >
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        id="draggable-dialog-title"
        sx={{ borderBottom: `1px solid ${theme.palette.divider}`, cursor: 'move' }}
      >
        <Grid item>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              {tooltipMessage ? (
                <Tooltip title={tooltipMessage} arrow>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <InfoIcon style={{ cursor: 'pointer' }} />
                    <Typography variant="title1" sx={{ ml: 1 }}>
                      {title}
                    </Typography>
                  </span>
                </Tooltip>
              ) : (
                <>
                  <InfoIcon />
                  <Typography variant="title1">{title}</Typography>
                </>
              )}
            </Stack>
          </DialogTitle>
        </Grid>
        <Grid item sx={{ mr: 1.5 }}>
          <IconButton color="secondary" onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Grid>
      </Grid>
      <DialogContent sx={{ whiteSpace: 'pre-line', ...rest.dialogcontentsx }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ ...rest.dialogactionsx }}>
        <Stack direction="row" spacing={2} sx={{ m: 1.5, mt: 0 }} alignItems="center">
          {actionComponent}
          <Stack direction="row" spacing={1} sx={{ ml: '10px !important' }}>
            {!disableConfirm && (
              <Button
                onClick={handleOk}
                color={rest?.confirmColor || 'primary'}
                variant={rest?.confirmVariant || 'contained'}
              >
                {confirmLabel || '확인'}
              </Button>
            )}
            {!disableCancel && (
              <Button
                onClick={handleClose}
                color={rest?.cancelColor || 'secondary'}
                variant={rest?.cancelVariant || 'outlined'}
              >
                {cancelLabel || '취소'}
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

PopUp.propTypes = {
  /**
   * 모달 제목.
   */
  title: PropTypes.string,
  /**
   * 모달 오픈 여부 상태값.
   */
  alertOpen: PropTypes.bool,
  /**
   * 모달 오픈 상태 변경 함수.
   */
  closeAlert: PropTypes.func,
  /**
   * 확인버튼 클릭 이벤트 함수.
   */
  callBack: PropTypes.func,
  /**
   * 취소버튼 숨김 여부.
   */
  disableCancel: PropTypes.bool,
  /**
   * 확인버튼 숨김 여부.
   */
  disableConfirm: PropTypes.bool,
  /**
   * 모달 하단에 추가할 컴포넌트.
   */
  actionComponent: PropTypes.any,
  /**
   * 모달 최대 가로길이 제한.
   */
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  /**
   * maxWidth 크기만큼 모달 사이즈 키우는지 여부.
   */
  fullWidth: PropTypes.bool,
  /**
   * 취소버튼 내용 값.
   */
  cancelLabel: PropTypes.string,
  /**
   * 확인버튼 내용 값.
   */
  confirmLabel: PropTypes.string,
  /**
   * 도움말 메시지 값.
   */
  tooltipMessage: PropTypes.string,
};

export default PopUp;
