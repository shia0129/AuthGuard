import { useSelector, useDispatch } from 'react-redux';
import { setMenuItem } from '@modules/redux/reducers/menu';

// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState,useRef } from 'react';
import useConfig from '@modules/hooks/useConfig';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({ searchType, searchOptions = {} }) => {
  const dispatch = useDispatch();

  // Tree Search Options.
  const {
    data: treeData = [],
    setData: setTreeData,
    placeHolder,
    size,
    inputStyle = {},
  } = searchOptions;

  const topMenuList = useSelector((state) => state.menu.menuItem.topItems);

  const selectedTopMenu = useSelector((state) => state.menu.selectedTopMenu);
  const topMenu = topMenuList.find((menu) => menu.menuId === selectedTopMenu);
  const { menuMode } = useConfig();

  const [treeOriginData, setTreeOriginData] = useState([]);
  const [menuArr, setMenuArr] = useState([]);
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  // Tree Initial Data.
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (treeData.length !== 0 && treeOriginData.length === 0){
      setTreeOriginData(treeData);
    } 
  }, [searchOptions.data]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (topMenu){
      setMenuArr(topMenu.children);
    } 
  }, [topMenu]);

  const filterList = (value, list) => {
    if (!searchType)
      return list.map((menu) => {
        if (menu.type === 'item' && menu.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          return menu;
        } else if (menu.children.length !== 0) {
          const children = filterList(value, menu.children);

          if (children.filter((data) => data !== undefined).length !== 0)
            return { ...menu, children: children.filter((data) => data !== undefined) };
        }
      });
    else if (searchType === 'tree') {
      return list.map((item) => {
        if (Array.isArray(item.children) && item.children.length !== 0) {
          const children = filterList(value, item.children).filter((data) => data !== undefined);
          if (item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1 || children.length !== 0)
            return {
              ...item,
              children,
            };
        }

        if (item.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          return item;
        }
      });
    }
  };

  const onSearchChange = (event) => {
    if (!searchType) {
      const menu = filterList(event.target.value, menuArr).filter((menu) => menu !== undefined);
      dispatch(
        setMenuItem({
          menuItem: !event.target.value ? topMenu.children : menu,
        }),
      );
    } else if (searchType === 'tree') {
      const treeList = filterList(event.target.value, treeOriginData).filter(
        (data) => data !== undefined,
      );
      setTreeData(treeList);
    }
  };

  return (
    <Box sx={{ width: '100%', ...(!searchType && { ml: { xs: 0, md: 2 } }), mb: '10px' }}>
      <FormControl
        sx={{
          '& .Mui-focused': { boxShadow: 'none !important' },
          width: !searchType ? { xs: '100%', md: 224 } : '100%',
        }}
      >
        <OutlinedInput
          size={size ?? 'small'}
          type="text"
          sx={{ ...(!searchType && { color: menuMode === 'dark' && 'white' }), ...inputStyle }}
          onChange={onSearchChange}
          startAdornment={
            <InputAdornment
              position="start"
              sx={{
                mr: -0.5,
                ...(!searchType && { color: menuMode === 'dark' && 'white' }),
              }}
            >
              <SearchOutlined />
            </InputAdornment>
          }
          placeholder={placeHolder ?? '메뉴명을 입력하세요.'}
          autoComplete="off"
        />
      </FormControl>
    </Box>
  );
};

export default Search;
