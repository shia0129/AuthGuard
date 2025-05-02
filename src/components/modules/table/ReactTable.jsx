import PropTypes from 'prop-types';
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  forwardRef
} from 'react';
import NextLink from 'next/link';
import { unstable_batchedUpdates } from 'react-dom';

// Project import
import EditableCell from '@components/modules/table/EditableCell';
import ReactRow from './ReactRow';
import useConfig from '@modules/hooks/useConfig';
import TablePagination from './TablePagination';
import HsTablePagination from './HsTablePagination';
import HsLib from '@modules/common/HsLib';
import useAccess from '@modules/hooks/useAccess';

// material-ui
import {
  Box,
  Button,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DownOutlined,
  MinusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import useApi from '@modules/hooks/useApi';

// third-party
import {
  useBlockLayout,
  useExpanded,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useRowState,
  useSortBy,
  useTable,
} from 'react-table';
import { useSticky } from 'react-table-sticky';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { useIntl } from 'react-intl';
import reactStyled from 'styled-components';
import { TableVirtuoso } from 'react-virtuoso';
// react-sizeme 제거
// import { SizeMe } from 'react-sizeme';
import _ from 'lodash';
import IndeterminateCheckbox from './IndeterminateCheckbox';

const Styles = reactStyled.div`
  .table {
    &.sticky {
      overflow: scroll;
      .header {
        height: 40px;
        top: 0;
        position: sticky;
        z-index: 10;
      }
    }
  }
`;

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    maxWidth: 230,
  },
}));

// DefaultCell: 기존 컴포넌트 그대로 사용 (tableCellWidth prop을 받음)
const DefaultCell = ({ props, theme, tableCellWidth }) => {
  const textRef = useRef();
  const linkRef = useRef();
  const buttonRef = useRef();
  const cellRef = useRef();

  const [toolTipOpen, setToolTipOpen] = useState(false);

  const { value: initialValue, column, cell, row } = props;
  const collapseIcon = row.isExpanded ? <DownOutlined /> : <RightOutlined />;
  let initValue = initialValue;
  if (column.cellType === 'D')
    initValue = HsLib.reactRegisterDateRender(row, '$1-$2-$3', false, column.id);
  if (column.cellType === 'G') initValue = HsLib.reactRegisterDateRender(row, '$1-$2-$3', true);
  if (column.cellType === 'A')
    initValue = HsLib.changeDateFormat(initialValue, '$1-$2-$3 $4:$5:$6');
  if (column.cellType === 'B') initValue = HsLib.changeDateFormat(initialValue, '$1-$2-$3 $4:$5');
  if (column.cellType === 'H') initValue = HsLib.changeDateFormat(initialValue, '$4:$5');
  if (column.cellType === 'S') initValue = HsLib.changeDateFormat(initialValue, '$4:$5:$6');
  if (column.cellType === 'O') initValue = HsLib.changeDateFormat(initialValue, '$1-$2');
  if (column.cellType === 'I') {
    if (typeof initialValue === 'string' && Number(initialValue)) {
      initValue = Number(initialValue).toLocaleString().toString();
    } else if (typeof initialValue === 'number') {
      initValue = initialValue?.toLocaleString();
    }
  }
  if (column.cellType === 'C') {
    initValue = column.valueOptions.find((option) => {
      if (option.value === initValue?.toString()) return option;
    })?.label;
  }

  if (column.attributeType === 'H') {
    const trimString = column.attribute.replaceAll(' ', '');
    const splitAtrribute = trimString.replaceAll(/\[.*?\]/g, '');
    const arratAttribute = trimString.replaceAll(/[^\[\]]*(?=(?:[^\]]*\[[^\[]*\])*[^\[\]]*$)/g, '');
    const attribute = splitAtrribute
      .replaceAll(' ', '')
      .split(',')
      .map((item) => {
        const props = item.split(':');
        if (props[0] === 'parameter') {
          const array = arratAttribute
            .replace('[', '')
            .replace(']', '')
            .split(',')
            .map((item) => `"${item}"`);
          return `"${props[0]}" : [${array}]`;
        }
        return `"${props[0]}":"${props[1]}"`;
      });
    const object = JSON.parse(`{${attribute.join(',')}}`);
    const param = object.parameter;
    let query = { flag: object.flag };
    if (param) {
      for (let i = 0; i < param.length; i++) {
        query[param[`${i}`]] = row.original[param[`${i}`]];
      }
      return (
        <NextLink
          className="CMM-rt-defaultCell-hType-nextLink"
          href={{
            pathname: object.pathname,
            query: query,
          }}
          passHref
        >
          <Link
            className="CMM-rt-defaultCell-hType-nextLink-link"
            color={theme.palette.mode === 'dark' ? 'white' : 'black'}
            underline="none"
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              wordBreak: 'break-word',
              color: '#008ABB',
            }}
          >
            <BootstrapTooltip
              className="CMM-rt-defaultCell-hType-nextLink-link-bootstrapTooltip"
              title={initValue || ''}
              placement="top-start"
              open={toolTipOpen}
              onMouseEnter={() => {
                setToolTipOpen(linkRef.current.clientWidth > column.width);
              }}
              onMouseLeave={() => {
                if (toolTipOpen) setToolTipOpen(!toolTipOpen);
              }}
            >
              <Box
                ref={linkRef}
                component="p"
                sx={{ m: 0, display: 'inline-block' }}
                className="CMM-rt-defaultCell-hType-nextLink-link-bootstrapTooltip-box"
              >
                {cell.isGrouped ? (
                  <Stack direction="row" alignItems="center">
                    {cell.isGrouped && (
                      <Box
                        className="CMM-rt-rowArea-tableCell-stack-box"
                        sx={{ pr: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
                        {...row.getToggleRowExpandedProps()}
                      >
                        {collapseIcon}
                      </Box>
                    )}
                    {initValue}
                  </Stack>
                ) : (
                  initValue
                )}
              </Box>
            </BootstrapTooltip>
          </Link>
        </NextLink>
      );
    }
  }

  if (column.attributeType === 'C') {
    const renderCell = cell.render('Cell');
    return (
      <BootstrapTooltip
        className="CMM-rt-defaultCell-cType-bootstrapTooltip"
        title={initValue || ''}
        placement="top-start"
        open={toolTipOpen}
        onMouseEnter={() => {
          if (tableCellWidth > 0) {
            setToolTipOpen(cellRef?.current?.children[0]?.scrollWidth > tableCellWidth);
          } else {
            setToolTipOpen(cellRef?.current?.children[0]?.scrollWidth > column.width);
          }
        }}
        onMouseLeave={() => {
          if (toolTipOpen) setToolTipOpen(!toolTipOpen);
        }}
      >
        <Box
          className="CMM-rt-defaultCell-cType-bootstrapTooltip-box"
          ref={cellRef}
          sx={{
            m: 0,
            display: 'inline-block',
            width: 1,
            '& a,p': {
              maxWidth:
                tableCellWidth > 0
                  ? tableCellWidth > column.width
                    ? tableCellWidth
                    : column.width
                  : '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              verticalAlign: 'middle',
            },
          }}
        >
          {cell.isGrouped ? (
            <Stack direction="row" alignItems="center">
              {cell.isGrouped && (
                <Box
                  className="CMM-rt-rowArea-tableCell-stack-box"
                  sx={{ pr: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
                  {...row.getToggleRowExpandedProps()}
                >
                  {collapseIcon}
                </Box>
              )}
              {renderCell}
            </Stack>
          ) : (
            renderCell
          )}
        </Box>
      </BootstrapTooltip>
    );
  }

  if (column.attributeType === 'B') {
    return (
      <BootstrapTooltip
        className="CMM-rt-defaultCell-bType-bootstrapTooltip"
        title={initValue || ''}
        placement="top-start"
        open={toolTipOpen}
        onMouseEnter={() => {
          setToolTipOpen(buttonRef.current.clientWidth > column.width);
        }}
        onMouseLeave={() => {
          if (toolTipOpen) setToolTipOpen(!toolTipOpen);
        }}
      >
        {'buttonProps' in column ? (
          <Button
            {...column.buttonProps}
            ref={buttonRef}
            variant={column.buttonProps.variant || 'contained'}
            onClick={(event) => {
              if (typeof column?.buttonCallback === 'function')
                column.buttonCallback({ event, cell });
            }}
            sx={{ maxHeight: '100%', width: '100%', ...column.buttonProps.sx }}
          >
            {column.buttonProps?.contents || initValue}
          </Button>
        ) : (
          <Link
            className="CMM-rt-defaultCell-bType-bootstrapTooltip-link"
            onClick={(event) => {
              if (typeof column?.buttonCallback === 'function')
                column.buttonCallback({ event, cell });
            }}
            underline="none"
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              wordBreak: 'break-word',
              color: '#008ABB',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <Box
              ref={buttonRef}
              component="p"
              sx={{ m: 0, display: 'inline-block' }}
              className="CMM-rt-defaultCell-bType-bootstrapTooltip-link-box"
            >
              {cell.isGrouped ? (
                <Stack direction="row" alignItems="center">
                  {cell.isGrouped && (
                    <Box
                      className="CMM-rt-rowArea-tableCell-stack-box"
                      sx={{ pr: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
                      {...row.getToggleRowExpandedProps()}
                    >
                      {collapseIcon}
                    </Box>
                  )}
                  {initValue}
                </Stack>
              ) : (
                initValue
              )}
            </Box>
          </Link>
        )}
      </BootstrapTooltip>
    );
  }

  return (
    <BootstrapTooltip
      className="CMM-rt-defaultCell-bootstrapTooltip"
      title={initValue || ''}
      placement="top"
      open={toolTipOpen}
      onMouseOver={() => {
        if (tableCellWidth > 0) {
          setToolTipOpen(textRef.current.clientWidth > tableCellWidth - 17);
        } else {
          setToolTipOpen(textRef.current.clientWidth > column.width - 17);
        }
      }}
      onMouseLeave={() => {
        if (toolTipOpen) setToolTipOpen(!toolTipOpen);
      }}
    >
      <Typography
        className="CMM-rt-defaultCell-bootstrapTooltip-typography"
        ref={textRef}
        sx={{
          display: 'inline-block',
          maxWidth:
            tableCellWidth > 0 && tableCellWidth > column.width
              ? tableCellWidth - 16
              : column.width - 16,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {cell.isGrouped ? (
          <Stack direction="row" alignItems="center">
            {cell.isGrouped && (
              <Box
                className="CMM-rt-rowArea-tableCell-stack-box"
                sx={{ pr: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}
                {...row.getToggleRowExpandedProps()}
              >
                {collapseIcon}
              </Box>
            )}
            {initValue}
          </Stack>
        ) : (
          initValue
        )}
      </Typography>
    </BootstrapTooltip>
  );
};

const areEqual = (a, b) => {
  if (
    (b.gridInfo && a.gridInfo !== b.gridInfo) ||
    (b.columns && a.columns !== b.columns) ||
    (b.data && a.data !== b.data) ||
    (b.checkList && a.checkList !== b.checkList) ||
    (b.gridInfo && a.gridInfo.listInfo !== b.gridInfo.listInfo) ||
    a.hiddenColumns !== b.hiddenColumns ||
    (b.columnCollapse && a.columnCollapse !== b.columnCollapse)
  ) {
    return false;
  }
  return true;
};

/**
 * React Table 정의
 * (생략된 propTypes 등은 기존과 동일)
 */
function ReactTable({
  columns,
  hiddenColumns,
  data,
  setData,
  disabledFooter,
  checkList = [],
  onChangeChecked,
  id,
  gridInfo = { api: {}, listInfo: {}, parameters: {}, total: 0 },
  setGridInfo,
  parameters = { current: null },
  setParameters,
  setUpdateData,
  listFuncName,
  searchParameters,
  columnCollapse,
  setColumnCollapse,
  rowState,
  totalPage,
  pageSelectNum,
  pageInputNum,
  miniPaging,
  rowSelectHandler,
  disableHeaderCheckbox = false,
  groupBy = [],
  sortList = [],
  enableHsPage = false,
  ...rest
}) {
  const listInfo = gridInfo.listInfo;
  const [toggleAll, setToggleAll] = useState(false);
  const [sortColumnInformation, setSortColumnInformation] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [apiCall] = useApi();
  const memoizedData = useMemo(() => {
    if (_.isEmpty(data)) return data;
    const inputData = [...data];
    if (columnCollapse && columnCollapse.isOpen && columnCollapse.index != null) {
      inputData.splice(columnCollapse.index, 0, { ...columnCollapse, isExpandCell: true });
    }
    return inputData;
  }, [data, columnCollapse?.isOpen, columnCollapse?.index]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const { update } = useAccess();
  const intl = useIntl();
  const scrollRef = useRef(null);
  const theme = useTheme();
  const { tableMode } = useConfig();
  const tableInfoRef = useRef(null);
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  const useEffect_0005 = useRef(false);
  const useEffect_0006 = useRef(false);
  const useEffect_0007 = useRef(false);
  const useEffect_0008 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    checkList?.forEach((item) => {
      const index = data.findIndex((object) => object['id'] === item.id);
      toggleRowSelected(index, true);
    });
  }, [data]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (checkList.length === 0) setToggleAll(false);
  }, [checkList]);

  const updateMyData = (row, columnId, value) => {
    setData((prevData) => {
      const tempData = [...prevData];
      const index = tempData.findIndex((prevRow) => prevRow.id === row.original.id);
      tempData[index] = {
        ...tempData[index],
        [columnId]: value,
        status: tempData[index].status === 'I' ? 'I' : 'U',
      };
      return tempData;
    });
    setUpdateData((prevData) => {
      const tempData = [...prevData];
      const index = tempData.findIndex((prevRow) => prevRow.id === row.original.id);
      tempData[index] = {
        ...tempData[index],
        [columnId]: value,
        status: tempData[index]?.status === 'I' ? 'I' : 'U',
      };
      return tempData;
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    flatHeaders,
    prepareRow,
    page,
    setPageSize: setSize,
    totalColumnsWidth,
    state: { pageSize: size },
    toggleAllRowsSelected,
    toggleRowSelected,
    setHiddenColumns,
    setSortBy,
  } = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: 25,
        rowState: { ...rowState },
        groupBy: groupBy.length ? [...groupBy] : [],
      },
      updateMyData,
      listInfo,
      manualSortBy: true,
      sx: parameters.current?.sx,
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    useResizeColumns,
    usePagination,
    'N' === listInfo?.fitWidth && useSticky,
    'N' === listInfo?.fitWidth ? useBlockLayout : useFlexLayout,
    useRowSelect,
    useRowState,
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0003.current){
        useEffect_0003.current = true;
        return; 
      } 
    }
    if (Array.isArray(hiddenColumns)) setHiddenColumns(hiddenColumns);
  }, [hiddenColumns]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0004.current){
        useEffect_0004.current = true;
        return; 
      } 
    }
    if (parameters.current) {
      setSize(parameters.current?.size);
    }
  }, [parameters.current?.size]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = page.map((row) => row.original);
      onChangeChecked(newSelected);
      setToggleAll(true);
      return;
    }
    setToggleAll(false);
    onChangeChecked([]);
  };

  const handleClick = (event, originalInfo, rowInfo) => {
    if (event.target.checked !== undefined) {
      const selectedIndex = checkList.findIndex((item) => item.id === originalInfo.id);
      const row = data.filter((object) => object['id'] === originalInfo.id);

      if (rowInfo.isSelected && listInfo.tableEditable === 'Y') {
        setUpdateData((prevUpdateData) => {
          const rowData = data.find((rowData) => rowData.id === originalInfo.id);
          return prevUpdateData.map((updateData) => {
            if (updateData.id === originalInfo.id) {
              return { ...rowData };
            } else return updateData;
          });
        });
      }

      if (row[0].status === 'I') {
        const newArray = [...data];
        newArray.splice(newArray.findIndex((prev) => row[0].id === prev.id), 1);
        toggleRowSelected(originalInfo.id, false);
        setData(newArray);
        if (listInfo.tableEditable === 'Y') setUpdateData(newArray);
      } else {
        let newSelected = [];
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(checkList, originalInfo);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(checkList.slice(1));
        } else if (selectedIndex === checkList.length - 1) {
          newSelected = newSelected.concat(checkList.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            checkList.slice(0, selectedIndex),
            checkList.slice(selectedIndex + 1)
          );
        }
        onChangeChecked(newSelected);
        let tempData = [...data];
        setData(tempData);
      }
    }
  };

  let fixColumnWidth = 0;
  const handleSortData = async ({ sortDirection, id }) => {
    const direction = sortDirection === undefined ? '' : sortDirection ? 'desc' : 'asc';
    const sort = `${id},${direction}`;
    const params = searchParameters ? searchParameters(parameters.current) : parameters.current;
    const result = await apiCall(gridInfo.api[`${listFuncName}`], {
      ...params,
      sort,
    });
    if (result && result.status === 200) {
      setSortColumnInformation(sort);
      setParameters({ ...parameters.current, sort });
      setData(result.data.content);
    }
  };

  // RowContents: react-virtuoso Table Row 내의 각 Cell 정의.
  const RowContents = useCallback(
    (_, row) => {
      prepareRow(row);
      const { original } = row;
      if (original?.isExpandCell)
        return (
          <TableCell
            sx={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={row.cells.length}
            className="CMM-rt-rowArea-tableCell"
          >
            <Box sx={{ margin: 1 }} className="CMM-rt-rowArea-tableCell-box">
              {original?.cellInfo}
            </Box>
          </TableCell>
        );
      return (
        <>
          {row.cells.map((cell, index) => (
            <TableCell
              className="CMM-rt-rowArea-tableCell"
              key={index}
              align={
                cell.column.rowAlign ||
                (cell.column.id === 'row-selection-chk' ? 'center' : 'left')
              }
              onClick={(event) => {
                if (cell.column.id === 'row-selection-chk')
                  handleClick(event, cell.row.original, row);
                else {
                  rest?.onClick && rest?.onClick(event, cell, row);
                }
              }}
              {...cell.getCellProps([{ className: cell.column.className }])}
              sx={{
                '&[data-sticky-td]': {
                  backgroundColor: row.isSelected
                    ? theme.palette.mode === 'dark'
                      ? '#45495b'
                      : '#e9edff'
                    : theme.palette.grey[0],
                },
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                bgcolor:
                  !groupBy.length &&
                  row.original.fitWidth === 'Y' &&
                  cell.column.id === 'cellWidth'
                    ? theme.palette.mode === 'dark'
                      ? '#1E1E1E'
                      : '#F5F5F5'
                    : !groupBy.length && row.original.boardTopYn === 'Y'
                    ? theme.palette.mode === 'dark'
                      ? '#1E1E1E'
                      : '#F7F7F7'
                    : 'inherit',
                height: parameters.current?.itemHeight,
                maxWidth:
                  cell.column?.id === 'row-selection-chk' || cell.column?.id === 'no'
                    ? '50px'
                    : null,
                display: cell.column.defaultYn === 'N' && 'none',
                p: 'buttonProps' in cell.column && cell.column.attributeType === 'B' ? 0 : null,
              }}
            >
              {cell.column.id === 'no' ? (
                row.index + 1 + size * pageIndex
              ) : cell.column.id === 'row-selection-chk' ? (
                <IndeterminateCheckbox sx={{ p: 0 }} {...row.getToggleRowSelectedProps()} />
              ) : !(
                  (checkList.find((item) => item.id === row.original.id) ||
                    row.original?.addColumnFlag === true) &&
                  !toggleAll
                ) ||
                listInfo.tableEditable === 'N' ||
                (row.original?.addColumnFlag !== true && !update) ? (
                cell.render((param) => (
                  <div
                    style={{
                      height:
                        'buttonProps' in cell.column && cell.column.attributeType === 'B'
                          ? '100%'
                          : null,
                    }}
                  >
                    <DefaultCell
                      className="CMM-rt-rowArea-tableCell-stack-defaultCell"
                      props={param}
                      theme={theme}
                      // react-sizeme 대신 cell.column.width를 사용 (없으면 'auto')
                      tableCellWidth={cell.column.width || 'auto'}
                    />
                  </div>
                ))
              ) : (
                cell.render(EditableCell)
              )}
            </TableCell>
          ))}
        </>
      );
    },
    [rows, listInfo, theme, flatHeaders, toggleAll]
  );

  const sortEventHandler = (column) => {
    if (parameters.current?.sort && column?.id !== 'row-selection-chk' && column?.id !== 'no') {
      let direction;
      if (column.isSortedDesc === false) {
        direction = true;
      } else if (column.isSortedDesc === true) {
        direction = undefined;
      } else if (column.isSortedDesc === undefined) {
        direction = false;
      }
      column.toggleSortBy(direction);
      handleSortData({ sortDirection: direction, id: column.id });
    }
  };

  const HeaderContents = () => {
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
        if (!useEffect_0005.current){
          useEffect_0005.current = true;
          return; 
        } 
      }
      if (parameters.current && parameters.current?.sort) {
        if (_.isString(parameters.current.sort)) {
          const sortString = parameters.current.sort.split(',');
          setSortBy([{ id: sortString[0], desc: sortString[1].toLowerCase() === 'asc' ? false : true }]);
        }
      }
    }, [parameters?.sort]);
    return headerGroups.map((headerGroup, i) => (
      <TableRow
        className="CMM-rt-headerArea-tableRow"
        key={i}
        {...headerGroup.getHeaderGroupProps()}
        sx={{
          '& [data-sticky-td]': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
        height={parameters.current?.headerHeight}
      >
        {headerGroup.headers.map((column, index) => {
          const isSort =
            column?.id !== 'row-selection-chk' &&
            column?.id !== 'no' &&
            (sortList === 'all' || sortList.includes(column.id));
          return (
            <TableCell
              className="CMM-rt-headerArea-tableRow-tableCell"
              key={index}
              align={column.headerAlign || 'left'}
              onClick={(event) => {
                if (!disableHeaderCheckbox && column?.id === 'row-selection-chk')
                  handleSelectAllClick(event);
              }}
              {...column.getHeaderProps([{ className: column.className }])}
              sx={{
                whiteSpace: 'nowrap',
                py: 1,
                height: parameters.current?.headerHeight ? parameters.current?.headerHeight : 40,
                maxHeight: parameters.current?.headerHeight ? parameters.current?.headerHeight : 40,
                borderBottom: '1px solid #d4d8e1 !important',
                borderTop: '1px solid #d4d8e1 !important',
                backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FAFAFA',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: column?.id === 'row-selection-chk' || column?.id === 'no' ? '50px' : null,
                display: column.defaultYn === 'N' && 'none',
              }}
            >
              <Stack
                className="CMM-rt-headerArea-tableRow-tableCell-stack"
                direction="row"
                sx={{ height: '100%' }}
                justifyContent="center"
                alignItems="center"
              >
                {disableHeaderCheckbox && column?.id === 'row-selection-chk' ? null : column?.id === 'row-selection-chk' ? (
                  column.render(({ getToggleAllPageRowsSelectedProps }) => (
                    <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
                  ))
                ) : (
                  <Typography
                    className="CMM-rt-headerArea-tableRow-tableCell-stack-typography"
                    onClick={() => isSort && sortEventHandler(column)}
                    sx={{ cursor: isSort && 'pointer' }}
                  >
                    {column.id === 'row-selection-chk'
                      ? column.render(({ getToggleAllPageRowsSelectedProps }) => (
                          <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
                        ))
                      : intl.messages[column.render('Header')]
                      ? intl.messages[column.render('Header')]
                      : column.render('Header')}
                  </Typography>
                )}
                {parameters.current?.sort?.split(',')[0] &&
                isSort &&
                column.isSortedDesc === false ? (
                  <CaretUpOutlined
                    className="CMM-rt-headerArea-tableRow-tableCell-stack-stack-caretDownOutlined"
                    style={{ color: theme.palette.success.main }}
                    onClick={() => sortEventHandler(column)}
                  />
                ) : column.isSortedDesc === true ? (
                  <CaretDownOutlined
                    className="CMM-rt-headerArea-tableRow-tableCell-stack-stack-caretDownOutlined"
                    style={{ color: theme.palette.success.main }}
                    onClick={() => sortEventHandler(column)}
                  />
                ) : null}
                {'N' === listInfo?.fitWidth && (
                  <Box
                    className="CMM-rt-headerArea-tableRow-tableCell-stack-box"
                    {...column.getResizerProps()}
                    sx={{ position: 'absolute', right: -6, opacity: 0, zIndex: 1 }}
                  >
                    <MinusOutlined className="CMM-rt-headerArea-tableRow-tableCell-stack-box-minusOutlined" />
                  </Box>
                )}
              </Stack>
            </TableCell>
          );
        })}
      </TableRow>
    ));
  };

  memoizedColumns.forEach((data) => {
    if (listInfo?.fitWidth === 'N' && data.sticky) fixColumnWidth += data.width;
  });

  const Scroller = useCallback(
    forwardRef(function RenderScroller({ children, ...props }, ref) {
      const [initialize, osInstance] = useOverlayScrollbars({
        options: {
          scrollbars: {
            visibility: 'visible',
            theme: theme.palette.mode === 'dark' ? 'os-theme-light' : 'os-theme-dark',
          },
        },
      });
      useEffect(() => {
        if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
          if (!useEffect_0006.current){
            useEffect_0006.current = true;
            return; 
          } 
        }
        initialize({
          target: listInfo?.fitHeight === 'Y' ? ref.current : scrollRef.current,
          elements: { viewport: listInfo?.fitHeight === 'Y' && ref.current },
        });
        return () => osInstance()?.destroy();
      }, [initialize]);
      useEffect(() => {
        if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
          if (!useEffect_0007.current){
            useEffect_0007.current = true;
            return; 
          } 
        }
        scrollRef.current = osInstance();
      }, [osInstance]);
      const refSetter = useCallback(
        (node) => {
          if (ref && node) {
            ref.current = node;
          }
        },
        [ref]
      );
      return (
        <TableContainer
          className="CMM-rt-scrollerArea-tableContainer"
          sx={{
            height: listInfo?.fitHeight === 'Y' && 'calc(100vh - 335px)',
            display: listInfo?.fitHeight === 'Y' ? undefined : 'flex',
            flex: listInfo?.fitHeight === 'Y' ? undefined : 1,
            flexDirection: listInfo?.fitHeight === 'Y' ? undefined : 'column',
            '& .os-scrollbar-horizontal': { left: `${fixColumnWidth}px !important` },
            '& .os-scrollbar-vertical': { zIndex: '10 !important', visibility: listInfo?.fitHeight === 'N' && 'hidden' },
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
              ...(id === 'PermissionForm' && { p: 0 }),
            },
            '& .MuiTableCell-root:nth-of-type(1)': {
              borderLeft: tableMode === 'vertical' && '1px solid #e6ebf1',
              ...(id === 'PermissionForm' && { p: 0 }),
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
    }),
    [theme, tableMode, listInfo]
  );

  const Header = useCallback(
    forwardRef(function RenderHeader(props, ref) {
      return (
        <TableHead
          {...props}
          ref={ref}
          className="header CMM-rt-headerArea-tableHead"
          sx={{ border: 0, zIndex: '4 !important' }}
        />
      );
    }),
    []
  );

  const TableComponents = useCallback(
    {
      Scroller,
      Table: (props) => (
        <Table
          {...getTableProps()}
          {...props}
          size="small"
          stickyHeader
          className="table sticky CMM-rt-tableArea-table"
          id={id}
          sx={{
            flex: 1,
            width: 'N' === listInfo?.fitWidth ? totalColumnsWidth : undefined,
            borderCollapse: 'separate',
            ...{ ...props.style, ...getTableProps().style },
          }}
          ref={tableInfoRef}
        />
      ),
      TableHead: Header,
      TableRow: ({ item, ...props }) => {
        const { original, index, isSelected } = item;
        if (original?.isExpandCell && original?.isOpen) {
          return (
            <TableRow
              className="CMM-rt-tableArea-tableRow"
              {...item.getRowProps({ style: { ...props.style, backgroundColor: 'rgba(0,0,0,0)!important' } })}
              {...props}
              height={parameters.current?.itemHeight}
            />
          );
        }
        return (
          <ReactRow
            className="CMM-rt-tableArea-reactRow"
            row={item}
            theme={theme}
            id={id}
            onClick={() => {
              if (typeof rowSelectHandler === 'function') {
                toggleRowSelected(index, !isSelected);
                rowSelectHandler(item, toggleRowSelected, toggleAllRowsSelected);
              } else if (setColumnCollapse) {
                setColumnCollapse((prev) => {
                  if (!prev.index) {
                    return { ...prev, index: index + 1, isOpen: true };
                  } else {
                    return {
                      ...prev,
                      index: prev.index - 1 === index ? null : prev.index < index ? index : index + 1,
                      isOpen: prev.index - 1 === index ? false : true,
                    };
                  }
                });
              }
            }}
            {...props}
            height={parameters.current?.itemHeight}
          />
        );
      },
      TableBody: forwardRef(function RenderBody({ children, ...props }, ref) {
        return (
          <TableBody
            {...getTableBodyProps()}
            {...props}
            ref={ref}
            className="body CMM-rt-tableArea-tableBody"
          >
            {children.find((child) => child != null) ? (
              children
            ) : (
              <TableRow className="CMM-rt-tableArea-tableBody-tableRow">
                <TableCell
                  colSpan={flatHeaders.length}
                  sx={{ border: '0 !important' }}
                  className="CMM-rt-tableArea-tableBody-tableRow-tableCell"
                >
                  <Grid container item justifyContent="center" my={3} className="CMM-rt-tableArea-tableBody-tableRow-tableCell-grid">
                    데이터가 존재하지 않습니다.
                  </Grid>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        );
      }),
    },
    [listInfo, totalColumnsWidth, theme, intl, flatHeaders, toggleRowSelected, toggleAllRowsSelected]
  );

  const ref = useRef(0);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0008.current){
        useEffect_0008.current = true;
        return; 
      } 
    }
    if (ref.current !== 0) {
      unstable_batchedUpdates(() => {
        setPageIndex(0);
        setParameters({ ...parameters.current, page: 0 });
        reloadData();
      });
    }
    ref.current = gridInfo.total;
  }, []);

  const reloadData = async () => {
    const params = searchParameters ? searchParameters(parameters.current) : parameters.current;
    let func = gridInfo.api[`${listFuncName}`];
    if (typeof func === 'function') {
      const result = await apiCall(gridInfo.api[`${listFuncName}`], { ...params });
      if (result.status === 200) {
        setData(result.data.content);
      }
    }
  };

  let maxPageSize = Math.ceil(gridInfo.total / size);
  const onChangePage = (event, changedPage, changedSize) => {
    if (pageIndex === changedPage) setPageIndex(changedPage);
    if (changedSize !== size) setSize(changedSize);
  };

  return (
    <Styles
      className="CMM-rt-styles"
      style={{
        display: listInfo?.fitHeight !== 'Y' && 'flex',
        flex: listInfo?.fitHeight !== 'Y' && 1,
        flexDirection: listInfo?.fitHeight !== 'Y' && 'column',
      }}
    >
      <TableVirtuoso
        className="CMM-rt-styles-tableVirtuoso"
        useWindowScroll={listInfo?.fitHeight === 'Y' ? false : true}
        data={rows}
        overscan={{ main: 3000, reverse: 3000 }}
        components={TableComponents}
        fixedHeaderContent={HeaderContents}
        itemContent={RowContents}
        sx={{ ...parameters.current?.sx }}
      />
      {!disabledFooter && listInfo?.showFooter === 'Y' && !enableHsPage && (
        <TablePagination
          className="CMM-rt-styles-tablePagination"
          listFuncName={listFuncName}
          scrollRef={scrollRef}
          rows={rows}
          setSize={setSize}
          size={Number(size)}
          page={pageIndex}
          setPage={setPageIndex}
          setData={setData}
          setUpdateData={setUpdateData}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          setParameters={setParameters}
          onChangeChecked={onChangeChecked}
          checkList={checkList}
          toggleAllRowsSelected={toggleAllRowsSelected}
          searchParameters={searchParameters}
          totalPage={totalPage}
          pageSelectNum={pageSelectNum}
          pageInputNum={pageInputNum}
          miniPaging={miniPaging}
          parameters={parameters}
          sortColumnInformation={sortColumnInformation}
        />
      )}
      {enableHsPage && (
        <HsTablePagination
          className="CMM-rt-styles-tablePagination"
          size={Number(size)}
          pageCount={maxPageSize}
          currentPage={pageIndex}
          onChangePage={onChangePage}
        />
      )}
    </Styles>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  hiddenColumns: PropTypes.array,
  data: PropTypes.array.isRequired,
  setData: PropTypes.func,
  disabledFooter: PropTypes.bool,
  checkList: PropTypes.array,
  onChangeChecked: PropTypes.func,
  id: PropTypes.string,
  gridInfo: PropTypes.shape({
    api: PropTypes.object,
    listInfo: PropTypes.object,
    parameters: PropTypes.object,
    total: PropTypes.number,
  }),
  setGridInfo: PropTypes.func.isRequired,
  parameters: PropTypes.shape({ current: PropTypes.object }),
  setParameters: PropTypes.func.isRequired,
  setUpdateData: PropTypes.func,
  listFuncName: PropTypes.string,
  searchParameters: PropTypes.func,
  columnCollapse: PropTypes.shape({
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    isOpen: PropTypes.bool,
    cellInfo: PropTypes.any,
  }),
  setColumnCollapse: PropTypes.func,
  rowState: PropTypes.object,
  totalPage: PropTypes.bool,
  pageSelectNum: PropTypes.bool,
  pageInputNum: PropTypes.bool,
  miniPaging: PropTypes.bool,
  rowSelectHandler: PropTypes.func,
  disableHeaderCheckbox: PropTypes.bool,
  groupBy: PropTypes.arrayOf(PropTypes.string),
  sortList: PropTypes.arrayOf(PropTypes.string),
};

export default React.memo(ReactTable, areEqual);
