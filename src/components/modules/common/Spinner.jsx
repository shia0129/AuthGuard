import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

/**
 * 중앙 정렬된 로딩 스피너 (폼 데이터)
 */
export function CenteredSpinner({ size = 24 }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <CircularProgress size={size} />
    </Box>
  );
}

/**
 * 인라인용 작은 스피너 (버튼 옆)
 */
export function InlineSpinner({ size = 16 }) {
  return <CircularProgress size={size} />;
}

/**
 * 전체 페이지 오버레이 스피너 (로딩 가드)
 */
export function PageLoader({ open = false }) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
