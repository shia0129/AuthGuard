// Project import
import MainCard from '@components/mantis/MainCard';

// MUI
import { Popover, Typography, Stack, Button } from '@mui/material';

/**
 *
 * @param {String} name 제출하는 Form의 id
 * @param {Node} anchorEl 트리거 할 컴포넌트
 * @param {Function} anchorChange 트리거하는 컴포넌트 값을 null로 변경하는 함수
 * @param {Boolean} download 다운로드 여부
 * @param {String} tableId pdf로 변환될 table 의 id
 * @param {Boolean} pledgeDownload 서약서양식 다운로드 구분 값
 * @param {Node} children 팝업 내에 포함 될 자식 컴포넌트
 *
 */
function ConfirmPop({
  name,
  anchorEl,
  anchorChange,
  children,
  confirmMessage = '저장하시겠습니까?',
}) {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        anchorChange(null);
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      {children ? (
        <MainCard>{children}</MainCard>
      ) : (
        <MainCard>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h5">{confirmMessage}</Typography>
            <Stack direction="row" justifyContent="center" spacing={1.25}>
              <Button
                size="small"
                variant="contained"
                type="submit"
                form={name}
                onClick={() => {
                  anchorChange(null);
                }}
              >
                확인
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => anchorChange(null)}
              >
                취소
              </Button>
            </Stack>
          </Stack>
        </MainCard>
      )}
    </Popover>
  );
}

export default ConfirmPop;
