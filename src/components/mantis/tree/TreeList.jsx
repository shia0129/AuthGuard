// project imports
import TreeListItem from './TreeListItem';
import Search from '@components/layouts/MainLayout/Header/HeaderContent/Search';

// material-ui
import { Stack, SvgIcon } from '@mui/material';

import { useTheme } from '@mui/material/styles';

// third-party
import PropTypes from 'prop-types';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { TreeView } from '@mui/x-tree-view';

function MinusSquare(props) {
  return (
    <SvgIcon id="collapse_icon" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path
        id="collapse_icon"
        d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z"
      />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon id="expand_icon" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path
        id="expand_icon"
        d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"
      />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

// ==============================|| TREE VIEW - CUSTOMIZED ||============================== //

/**
 *
 * @param {*} children TreeList Custom 목록.
 * @param {Array} data TreeList 자동생성 목록 상태 값.
 * @param {Function} setData TreeList 자동생성 목록 상태 변경 함수.
 * @param {Object} searchOptions TreeList 검색기능 정보 객체. (data 값 필수.)
 * @param {Object} scrollbarOptions OverlayScrollbars 설정 정보
 */
function TreeList({
  children,
  data = null,
  setData,
  searchOptions = null,
  scrollbarOptions = { options: {}, events: {} },
  ...rest
}) {
  const theme = useTheme();

  const scrollRef = useRef(null);
  const [initialize, osInstance] = useOverlayScrollbars({
    // overlayscrollbars 초기화.
    options: {
      scrollbars: {
        autoHide: 'move',
        theme: theme.palette.mode === 'dark' ? 'os-theme-light' : 'os-theme-dark',
        ...scrollbarOptions.options.scrollbars,
      },
      defer: true,
      ...scrollbarOptions.options,
    },
    events: { ...scrollbarOptions.events },
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (scrollRef.current && initialize)
      initialize({
        target: scrollRef.current,
      });

    return () => osInstance()?.destroy();
  }, [initialize]);

  const renderTree = (treeList = []) =>
    treeList.map((item) => (
      <TreeListItem key={item.id} nodeId={item.id} label={item.label}>
        {Array.isArray(item.children) ? renderTree(item.children) : null}
      </TreeListItem>
    ));

  return (
    <TreeView
      {...rest}
      aria-label="customized"
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      sx={{
        height: '100%',
        flexGrow: 1,
        ...rest?.sx,
        ...(Object.prototype.hasOwnProperty.call(scrollbarOptions, 'style') && {
          ...scrollbarOptions.style,
        }),
      }}
      ref={scrollRef}
    >
      <Stack>
        {data && searchOptions && (
          <Search searchType="tree" searchOptions={{ data, setData, ...searchOptions }} />
        )}

        {!children && data ? renderTree(data) : children}
      </Stack>
    </TreeView>
  );
}

TreeList.propTypes = {
  /**
   * TreeList Custom 목록.
   */
  children: PropTypes.any,
  /**
   * TreeList 자동생성 목록 상태 값.
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
  /**
   * TreeList 자동생성 목록 상태 변경 함수.
   */
  setData: PropTypes.func,
  /**
   * TreeList 검색기능 정보 객체.
   * - **data props 필수**
   */
  searchOptions: PropTypes.shape({
    data: PropTypes.array,
    setData: PropTypes.func,
    placeHolder: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    inputStyle: PropTypes.object,
  }),
  /**
   * OverlayScrollbars 설정 정보
   * - [Overlay Scrollbars](https://github.com/KingSora/OverlayScrollbars/tree/v2.0.0)
   */
  scrollbarOptions: PropTypes.shape({
    options: PropTypes.object,
    events: PropTypes.object,
  }),
};

export default TreeList;
