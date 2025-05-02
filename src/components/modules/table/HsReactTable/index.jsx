import PropTypes from 'prop-types';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import ReactRow from '../ReactRow';
import useConfig from '@modules/hooks/useConfig';
import HsTablePagination from '../HsTablePagination';
import useAccess from '@modules/hooks/useAccess';
import { Table, TableBody, TableHead } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  useBlockLayout,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useTable,
} from 'react-table';
import { useSticky } from 'react-table-sticky';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { useIntl } from 'react-intl';
import reactStyled from 'styled-components';
import { TableVirtuoso } from 'react-virtuoso';
import _ from 'lodash';
import { RowContent } from '@components/modules/table/HsReactTable/RowContent';
import { TableHeaders } from '@components/modules/table/HsReactTable/TableHeaders';
import { HsTableContainer } from '@components/modules/table/HsReactTable/HsTableContainer';
import { TableRowNoData } from '@components/modules/button/TableRowNoData';
import { useDispatch } from 'react-redux';
import { resetGridCodeCache } from '@modules/redux/reducers/code';

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

const areEqual = (prevProps, nextProps) => {
  return (
    _.isEqual(prevProps.gridInfo, nextProps.gridInfo) &&
    _.isEqual(prevProps.columns, nextProps.columns) &&
    _.isEqual(prevProps.data, nextProps.data) &&
    _.isEqual(prevProps.checkList, nextProps.checkList) &&
    prevProps.parameters.current.page === nextProps.parameters.current.page &&
    prevProps.parameters.current.size === nextProps.parameters.current.size
  );
};

function Index({
  columns = [],
  data,
  checkList = [],
  onChangeChecked,
  id,
  gridInfo = { listInfo: {}, total: 0 },
  parameters = { current: null },
  setParameters,
  ...rest
}) {
  const listInfo = gridInfo.listInfo;
  const [toggleAll, setToggleAll] = useState(false);
  const dispatch = useDispatch();
  const pageIndex = parameters.current.page;
  const memoizedData = useMemo(() => {
    if (_.isEmpty(data)) return data;
    return [...data];
  }, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const { update } = useAccess();
  const intl = useIntl();
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
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
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
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (parameters.current) {
      setSize(parameters.current?.size);
    }
  }, [parameters.current?.size]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0003.current) {
        useEffect_0003.current = true;
        return;
      }
    }
    if (checkList.length === 0) setToggleAll(false);
  }, [checkList]);

  const ref = useRef(0);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0004.current) {
        useEffect_0004.current = true;
        return;
      }
    }
    if (ref.current !== 0) {
      unstable_batchedUpdates(() => {
        setParameters({ ...parameters.current, page: 0 });
      });
    }
    ref.current = gridInfo.total;
    return () => {
      dispatch(resetGridCodeCache()); // 코드 캐싱 정보 초기화.
    };
  }, []);

  const onChangePage = (event, page, size) => {
    setParameters({ ...parameters.current, page, size });
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
  } = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      listInfo,
      sx: parameters.current?.sx,
    },
    useGroupBy,
    useResizeColumns,
    usePagination,
    'N' === listInfo?.fitWidth && useSticky,
    'N' === listInfo?.fitWidth ? useBlockLayout : useFlexLayout,
    useRowSelect,
  );

  const RowContents = useCallback(
    (_, row) => {
      prepareRow(row);
      return (
        <RowContent
          rownum={row.index + 1 + size * pageIndex}
          checkList={checkList}
          onChangeChecked={onChangeChecked}
          row={row}
          toggleAll={toggleAll}
          itemHeight={parameters.current?.itemHeight}
          tableEditable={listInfo.tableEditable}
          update={update}
        />
      );
    },
    [rows, listInfo, theme, flatHeaders, toggleAll],
  );
  /*
    const HeaderContents = () => {
      return headerGroups.map((headerGroup, i) => {
        const headerGroupProps = headerGroup.getHeaderGroupProps();
        const { key: headerGroupKey, ...restHeaderGroupProps } = headerGroupProps;
        return (
          <TableHead key={headerGroupKey || i} {...restHeaderGroupProps}>
            <TableHeaders
              headerGroup={headerGroup}
              headerHeight={parameters.current?.headerHeight}
              page={page}
              onChangeChecked={onChangeChecked}
              setToggleAll={setToggleAll}
            />
          </TableHead>
        );
      });
    };
  */
  const HeaderContents = () => {
    return headerGroups.map((headerGroup, i) => (
      <TableHeaders
        key={i}
        headerGroup={headerGroup}
        headerHeight={parameters.current?.headerHeight}
        page={page}
        onChangeChecked={onChangeChecked}
        setToggleAll={setToggleAll}
      />
    ));
  };
  let fixColumnWidth = 0;
  if (memoizedColumns.length > 0) {
    memoizedColumns.forEach((col) => {
      if (listInfo?.fitWidth === 'N' && col.sticky) fixColumnWidth += col.width;
    });
  }

  const scrollRef = useRef(null);
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
        if (process.env.NODE_ENV === 'development') {
          //process.env.NODE_ENV === 'development'
          if (!useEffect_0005.current) {
            useEffect_0005.current = true;
            return;
          }
        }

        const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
        const target = listInfo?.fitHeight === 'Y' ? ref?.current : scrollRef?.current;

        if (
          !isBrowser ||
          !target ||
          !target.ownerDocument ||
          !target.ownerDocument.documentElement
        ) {
          return;
        }

        initialize({
          target,
          elements: {
            viewport: listInfo?.fitHeight === 'Y' ? ref.current : undefined,
          },
        });
        return () => osInstance()?.destroy();
      }, [initialize, ref, scrollRef, listInfo?.fitHeight]);

      useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
          //process.env.NODE_ENV === 'development'
          if (!useEffect_0006.current) {
            useEffect_0006.current = true;
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
        [ref],
      );

      return (
        <HsTableContainer
          id={id}
          fitHeight={listInfo?.fitHeight}
          fixColumnWidth={fixColumnWidth}
          tableMode={tableMode}
          rest={rest}
          refSetter={refSetter}
          scrollRef={scrollRef}
          props={props}
        >
          {children}
        </HsTableContainer>
      );
    }),
    [theme, tableMode, listInfo],
  );

  const TableTag = (props) => {
    return (
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
    );
  };

  const HeaderComponent = useCallback(
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
    [],
  );

  const Row = ({ item, ...props }) => {
    return (
      <ReactRow
        className="CMM-rt-tableArea-reactRow"
        row={item}
        theme={theme}
        id={id}
        {...props}
        height={parameters.current?.itemHeight}
      />
    );
  };

  const Body = function RenderBody({ children, ...props }, ref) {
    return (
      <TableBody
        {...getTableBodyProps()}
        {...props}
        ref={ref}
        className="body CMM-rt-tableArea-tableBody"
      >
        {children.some((child) => child != null) ? (
          children
        ) : (
          <TableRowNoData colSpan={flatHeaders.length} message={'데이터가 존재하지 않습니다.'} />
        )}
      </TableBody>
    );
  };

  const TableComponents = useMemo(
    () => ({
      Scroller,
      Table: TableTag,
      TableHead: HeaderComponent,
      TableRow: Row,
      TableBody: forwardRef(Body),
    }),
    [listInfo, totalColumnsWidth, theme, intl, flatHeaders],
  );

  let maxPageSize = Math.ceil(gridInfo.total / size);

  return (
    <Styles
      className="CMM-rt-styles"
      style={{
        display: listInfo?.fitHeight !== 'Y' && 'flex',
        flex: listInfo?.fitHeight !== 'Y' && 1,
        flexDirection: listInfo?.fitHeight !== 'Y' && 'column',
      }}
    >
      {!_.isEmpty(listInfo) && (
        <>
          <TableVirtuoso
            className="CMM-rt-styles-tableVirtuoso"
            useWindowScroll={listInfo?.fitHeight !== 'Y'}
            data={rows}
            overscan={{ main: 3000, reverse: 3000 }}
            components={TableComponents}
            fixedHeaderContent={HeaderContents}
            itemContent={RowContents}
            sx={{
              ...parameters.current?.sx,
            }}
          />
          <HsTablePagination
            className="CMM-rt-styles-tablePagination"
            size={Number(size)}
            totalCount={gridInfo.total}
            pageCount={maxPageSize}
            currentPage={pageIndex}
            onChangePage={onChangePage}
          />
        </>
      )}
    </Styles>
  );
}

Index.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  checkList: PropTypes.array,
  onChangeChecked: PropTypes.func,
  id: PropTypes.string,
  gridInfo: PropTypes.shape({
    listInfo: PropTypes.object,
    total: PropTypes.number,
  }),
  parameters: PropTypes.shape({ current: PropTypes.object }),
  setParameters: PropTypes.func.isRequired,
};

export default React.memo(Index, areEqual);
