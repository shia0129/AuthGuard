// Scroller.js
import React, { useCallback, useRef } from 'react';
import { Box, TableContainer } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const HsTableContainer = ({
  children,
  id,
  fitHeight,
  fixColumnWidth,
  tableMode,
  rest,
  refSetter,
  scrollRef,
  props,
}) => {
  const theme = useTheme();

  return (
    <TableContainer
      className="CMM-rt-scrollerArea-tableContainer"
      sx={{
        height: fitHeight === 'Y' && 'calc(100vh - 335px)',
        display: 'flex',
        flex: 1,
        '& .os-scrollbar-horizontal': {
          left: `${fixColumnWidth}px !important`,
        },
        '& .os-scrollbar-vertical': {
          zIndex: '10 !important',
          visibility: fitHeight === 'N' && 'hidden',
        },
        borderBottom: '1px solid #d4d8e1',
        flexDirection: 'column',
        '& .MuiTableHead-root': {
          backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.common.white,
        },
        '& .MuiTableCell-head:after': {
          width: tableMode === 'horizontal' ? '2px !important' : '1px !important',
          height: '100% !important',
          top: '0 !important',
        },
        '& [data-sticky-last-left-td]': {
          borderRight: tableMode === 'horizontal' && '1px solid #e6ebf1',
        },

        '& .MuiTableBody-root tr:last-child td': {
          borderBottom: '1px solid #f0f0f0',
        },
        '& .MuiTableRow-root': {
          borderBottom: theme.palette.mode === 'dark' && '1px solid #e6ebf1',
        },
        '& .MuiTableCell-root': {
          borderRight: tableMode === 'vertical' && '1px solid #e6ebf1',
          ...(id === 'PermissionForm' && {
            p: 0,
          }),
        },
        '& .MuiTableCell-root:nth-of-type(1)': {
          borderLeft: tableMode === 'vertical' && '1px solid #e6ebf1',
          ...(id === 'PermissionForm' && {
            p: 0,
          }),
        },
        ...rest.sx,
      }}
      ref={scrollRef}
    >
      <Box ref={refSetter} {...props} className="CMM-rt-scrollerArea-tableContainer-box">
        {children}
      </Box>
    </TableContainer>
  );
};
