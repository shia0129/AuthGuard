// TypeError: Cannot assign to read only property 'theme' 에러 발생 코드 RAINROOT
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  TableContainer,
  Stack,
  IconButton,
} from '@mui/material';
import IndeterminateCheckbox from '@components/modules/table/IndeterminateCheckbox';
import { useTheme } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useSelector } from 'react-redux';
import MiniTableCell from './MiniTableCell';

const headerCellStyle = (theme) => ({
  '&:last-of-type': {
    borderRight: 'none',
  },
  borderRight: '1px solid ',
  borderColor: `${theme.palette.grey[300]}`,
  backgroundColor: `${theme.palette.grey[50]}`,
  padding: '2px 8px',
  textAlign: 'center',
});

const cellStickyStyle = (width) => ({
  position: 'sticky',
  left: width,
  zIndex: 100,
});

/**
 *
 * @param {Array} columns 테이블 헤더 리스트
 * @param {Array} data 테이블 데이터 리스트
 * @param {Array} checkList 체크 리스트
 * @param {Function} onChangecheckList 체크 박스 변경 이벤트 핸들러
 * @param {String} maxHeight 테이블 최대높이
 * @param {Function} rowClick 로우클릭 이벤트 핸들러
 * @param {Function} cellClick 셀클릭 이벤트 핸들러
 * @param {Number} pageSize 미니 테이블 페이징 사이즈.
 * @param {Boolean} paging 미니 테이블 페이징 사용 여부.
 * @param {Object} sx MiniTable 각 구성요소 스타일 커스텀 객체.
 */
function MiniTable({
  columns = [],
  subColumns = [],
  data = [],
  checkList = [],
  onChangecheckList,
  maxHeight,
  rowClick,
  cellClick,
  ellipsis = false,
  pageSize = 10,
  paging = false,
  pagingSx = {
    prev: {},
    next: {},
    page: {},
  },
  sx = {
    box: {},
    container: {},
    table: {},
    head: {},
    headRow: {},
    headCell: {},
    subHeadCell: {},
    body: {},
    bodyRow: {},
    bodyCell: {},
  },
  onlyDark = false,
  outlineBorder = true,
  fixTableHeightSize = false,
  showNoData = true,
  fnCheckColSpan = null,
  colSpanTarget,
  colSpanNumber,
  hideColumn,
  ...rest
}) {
  const theme = useTheme();
  const [indeterFlag, setIndeterFlag] = useState(false);
  const [toggleAll, setToggleAll] = useState(false);

  const [page, setPage] = useState(1);
  const [originChkData, setOriginChkData] = useState(
    data.map((data) => (data?.check?.use === true ? data?.check?.checked : undefined)),
  );

  const allCodeList = useSelector((state) => state.code.allCodeList);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (checkList.length === data.length) {
      setIndeterFlag(false);
      setToggleAll(true);
    }
    if (checkList.length !== 0 && checkList.length < data.length) {
      setToggleAll(false);
      setIndeterFlag(true);
    }
  }, [checkList, originChkData]);

  const handleClick = (event, rowData) => {
    let checkListDataIndex = 0;

    if (event.target.checked) {
      const chkIndex = data.findIndex((list) => list.id === rowData.id);
      originChkData[`${chkIndex}`] = true;

      checkListDataIndex = checkList.findIndex((list) => list.id == rowData.id);

      if (checkListDataIndex === -1) {
        onChangecheckList((checkListData) => [...checkListData, rowData]);
      }
    } else {
      const chkIndex = data.findIndex((list) => list.id === rowData.id);
      originChkData[`${chkIndex}`] = false;

      const listData = checkList.filter((data) => data.id !== rowData.id);

      onChangecheckList(listData);

      if (listData.length === 0) {
        setIndeterFlag(false);
      }
    }
  };

  // 전체 선택 이벤트
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      onChangecheckList(data);
      setToggleAll(true);
      setIndeterFlag(false);
      setOriginChkData(originChkData.fill(true));
      return;
    }

    setToggleAll(false);
    setOriginChkData(originChkData.fill(false));

    onChangecheckList([]);
  };

  let headFixWidth = 0,
    bodyFixWidth = 0;
  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiTableContainer-root': {
          border: outlineBorder ? 'solid 1px' : 'none',
          borderColor: onlyDark ? '#8c8c8c77' : `${theme.palette.grey[300]}`,
          ...sx.box,
        },
        '& .MuiTableCell-root *': {
          fontSize: onlyDark ? '13px !important' : 'inherit',
        },
      }}
    >
      <TableContainer
        sx={{
          maxHeight: maxHeight,
          overflowX: 'hidden !important',
          ...sx.container,
        }}
      >
        <OverlayScrollbarsComponent>
          <Table
            sx={{
              maxWidth: '100%',
              '& th': { position: 'sticky !important' },
              ...rest.tableStyle,
              '& .MuiTableRow-root:hover': {
                backgroundColor: onlyDark ? '#1e1e1e !important' : '',
              },
              ...sx.table,
            }}
            aria-label="simple table"
            size="small"
            stickyHeader
          >
            <TableHead sx={{ backgroundColor: onlyDark ? '#292929' : '', ...sx.head }}>
              <TableRow sx={{ ...sx.headRow }}>
                {columns.map((column, mainIndex) => {
                  if (column.sticky && mainIndex !== 0)
                    headFixWidth += columns[mainIndex - 1].options?.minWidth || 0;
                  return (
                    <TableCell
                      colSpan={column?.colSpan || 1}
                      key={column.id}
                      sx={{
                        '&:last-of-type': {
                          borderRight: 'none',
                        },
                        borderRight: outlineBorder ? '1px solid ' : 'none',
                        borderColor: onlyDark ? '#8c8c8c77' : `${theme.palette.grey[300]}`,
                        backgroundColor: onlyDark ? '#292929' : `${theme.palette.grey[50]}`,
                        color: onlyDark ? '#ffffffaa !important' : '',
                        padding: '2px 8px',
                        zIndex: onlyDark ? 30 - mainIndex : '',
                        ...column.options,
                        ...sx.headCell,
                        ...column.headerOptions,
                        // ...headerCellStyle(theme),
                        // ...(column.sticky && cellStickyStyle(headFixWidth)),
                        // ...column.sx,
                        // ...sx.headCell,
                      }}
                    >
                      {column.id === 'check' ? (
                        <IndeterminateCheckbox
                          checked={Boolean(data.length) && toggleAll}
                          sx={{ padding: '5px 8px' }}
                          indeterminate={indeterFlag}
                          onChange={(event) => {
                            handleSelectAllClick(event);
                          }}
                        />
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
              {subColumns.map((subRow, index) => (
                <TableRow key={index}>
                  {subRow.map((subColumn, subIndex) => {
                    if (subColumn.sticky && subIndex !== 0)
                      headFixWidth += subRow[subIndex - 1].options?.minWidth || 0;
                    return (
                      <TableCell
                        key={subColumn.id}
                        sx={{
                          ...headerCellStyle(theme),
                          ...sx.subHeadCell,
                          ...(subColumn.sticky && cellStickyStyle(headFixWidth)),
                          ...subColumn.options,
                        }}
                      >
                        {subColumn.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody
              sx={{
                '& tr:last-of-type td': {
                  borderBottom:
                    fixTableHeightSize &&
                    (tablePage ? tablePage : page) ===
                      Math.ceil((totalDataCount ? totalDataCount : data.length) / pageSize) &&
                    (totalDataCount ? totalDataCount : data.length) % pageSize !== 0
                      ? '1px solid !important'
                      : 'none',
                  borderColor:
                    fixTableHeightSize &&
                    (tablePage ? tablePage : page) ===
                      Math.ceil((totalDataCount ? totalDataCount : data.length) / pageSize) &&
                    (totalDataCount ? totalDataCount : data.length) % pageSize !== 0
                      ? onlyDark
                        ? '#8c8c8c77 !important'
                        : `${theme.palette.grey[300]} !important`
                      : 'none',
                },
                '& tr > td': {
                  borderTop: '1px solid',
                  borderRight: outlineBorder ? '1px solid' : 'none',
                  '&:last-of-type': { borderRight: 'none' },
                  borderColor: onlyDark ? '#8c8c8c77' : `${theme.palette.grey[300]}`,
                  borderBottom: 'none',
                  ...sx.body,
                },
                // '& tr > td': {
                //   borderTop: '1px solid',
                //   borderRight: '1px solid',
                //   '&:last-of-type': { borderRight: 'none' },
                //   borderColor: theme.palette.grey[300],
                //   borderBottom: 'none',
                //   ...sx.body,
                // },
              }}
            >
              {data
                .filter((_, index) => pageSize * (page - 1) <= index && index < pageSize * page)
                .map((data, index) => {
                  bodyFixWidth = 0;
                  const bodyColumn = _.isEmpty(subColumns)
                    ? columns
                    : subColumns[subColumns.length - 1];
                  return (
                    <TableRow
                      key={index}
                      sx={{ cursor: 'pointer', ...sx.bodyRow }}
                      onClick={(event) => {
                        rowClick &&
                          (event.target.className.includes('check') ||
                          event.target.className.includes('button') ||
                          event.target.tagName === 'INPUT'
                            ? ''
                            : rowClick(event, data));
                      }}
                    >
                      {bodyColumn.map((columnData, index) => {
                        if (columnData.sticky && index !== 0)
                          bodyFixWidth += bodyColumn[index - 1].options?.minWidth || 0;

                        let cellData = Number.isInteger(data[columnData.id])
                          ? data[columnData.id]
                          : data[columnData.id] || '';
                        if ('codeType' in columnData) {
                          const code = allCodeList.find(
                            (code) =>
                              code.codeType === columnData.codeType && cellData === code.codeValue,
                          );
                          if (code) cellData = code.codeDesc;
                        }
                        return (
                          <TableCell
                            className={columnData.id}
                            key={columnData.id + index}
                            sx={{
                              padding: '4px 8px',
                              height: ellipsis ? 40 : '',
                              maxHeight: ellipsis ? 40 : '',
                              ...(columnData.sticky && {
                                ...cellStickyStyle(bodyFixWidth),
                                background: '#fff',
                              }),
                              color: onlyDark ? '#ffffffaa !important' : '',
                              ...sx.bodyCell,
                              ...columnData.options?.cell,
                            }}
                          >
                            <MiniTableCell
                              checkList={originChkData}
                              column={columnData}
                              item={data}
                              index={index}
                              onChangeCheck={handleClick}
                              ellipsis={ellipsis}
                              onClickCell={cellClick}
                            >
                              {cellData}
                            </MiniTableCell>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </OverlayScrollbarsComponent>
      </TableContainer>
      {paging && (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <IconButton
            size="small"
            onClick={() => {
              setPage((prev) => (prev !== 1 ? prev - 1 : prev));
            }}
            {...pagingSx.prev}
          >
            <ChevronLeft fontSize="small" sx={{ color: onlyDark ? '#fff' : 'inherit' }} />
          </IconButton>
          <Typography {...pagingSx.page}>
            {page} / {Math.ceil(data.length / pageSize)}
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              setPage((prev) => (prev !== Math.ceil(data.length / pageSize) ? prev + 1 : prev));
            }}
            {...pagingSx.next}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}

MiniTable.propTypes = {
  /**
   * MiniTable 헤더 객체 목록.
   * - **options는 모든 Cell에(head, body) 적용 될 스타일 정보.**
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      label: PropTypes.string,
      options: PropTypes.object,
    }),
  ),
  /**
   * MiniTable 데이터 객체 목록.
   * - **columnId는 columns 데이터에 지정한 ID**
   * - **id는 데이터 고유 ID.**
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      columnId: PropTypes.any,
      check: PropTypes.shape({
        use: PropTypes.bool,
        checked: PropTypes.bool,
      }),
      button: PropTypes.shape({
        title: PropTypes.string,
        onClick: PropTypes.func,
        sx: PropTypes.object,
      }),
    }),
  ),
  /**
   * 체크된 Row 상태 값.
   */
  checkList: PropTypes.array,
  /**
   * checkList 상태 변경 함수.
   */
  onChangecheckList: PropTypes.func,
  /**
   * MiniTable 최대 높이.
   */
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Row 클릭 이벤트 핸들러.
   */
  rowClick: PropTypes.func,
  /**
   * Cell 클릭 이벤트 핸들러.
   */
  cellClick: PropTypes.func,
  /**
   * 페이징 사이즈.
   */
  pageSize: PropTypes.number,
  /**
   * 페이징 사용 여부.
   */
  paging: PropTypes.bool,
  /**
   * MiniTable 각 요소 적용 스타일.
   */
  sx: PropTypes.shape({
    box: PropTypes.object,
    container: PropTypes.object,
    table: PropTypes.object,
    head: PropTypes.object,
    headRow: PropTypes.object,
    headCell: PropTypes.object,
    body: PropTypes.object,
    bodyRow: PropTypes.object,
    bodyCell: PropTypes.object,
  }),
  /**
   * 페이징 적용 스타일.
   */
  pagingSx: PropTypes.shape({
    prev: PropTypes.object,
    next: PropTypes.object,
    page: PropTypes.object,
  }),
};

export default MiniTable;
