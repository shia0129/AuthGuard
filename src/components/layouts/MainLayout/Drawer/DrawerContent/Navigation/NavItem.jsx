import PropTypes from 'prop-types';
import { forwardRef, useEffect,useCallback, useMemo, useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alpha } from '@mui/material/styles';

// next
import NextLink from 'next/link';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Box,
} from '@mui/material';

// project import
import { activeItem, selectedItem } from '@modules/redux/reducers/menu';
import { iconMap } from '@modules/common/menuParser';
import Transitions from '@components/@extended/Transitions';
import useConfig from '@modules/hooks/useConfig';

// mini-menu - wrapper
const PopperStyled = styled(Popper)(({ theme, menumode }) => ({
  overflow: 'visible',
  zIndex: 1202,
  minWidth: 180,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 33,
    left: -5,
    width: 10,
    height: 10,
    backgroundColor:
      menumode === 'dark'
        ? '#121212'
        : menumode === 'gray'
        ? '#F3F4F9'
        : theme.palette.background.paper,
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 120,
    borderLeft: `1px solid ${theme.palette.mode === 'dark' ? '#121212' : theme.palette.grey.A800}`,
    borderBottom: `1px solid ${
      theme.palette.mode === 'dark' ? '#121212' : theme.palette.grey.A800
    }`,
  },
}));
// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level, parentOpen }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const { drawerOpen, openItem, topMenuUseYn } = menu;

  const { menuMode } = useConfig();
  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  const [anchorEl, setAnchorEl] = useState(null);


  const handleClick = useCallback((event) => {
    setAnchorEl(event?.currentTarget || null);
    dispatch(selectedItem({ selectedItem: item }));
  }, [dispatch, item]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  let listItemProps = useMemo(() => {
    return {
      component: forwardRef(({ key, ...props }, ref) => { // ✅ key 분리
        const href = item?.url ?? "#"; // ✅ undefined 방지 (기본값 제공)
        
        return (
          <NextLink href={href} style={{ textDecoration: 'none' }} passHref> {/* ✅ `href` 값이 항상 존재하게 보장 */}
            <ListItemButton
              {...props}
              {...(!drawerOpen && { onMouseEnter: handleClick, onMouseLeave: handleClose })}
              onClick={handleClick}
              target={itemTarget}
              ref={ref}
            />
          </NextLink>
        );
      }),
    };
  }, [drawerOpen, item?.url]); // ✅ item.url 의존성 추가
  
  
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const Icon = iconMap(item.icon);
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
  ) : (
    false
  );

  let pathname = document.location.pathname;
  const urlList = item.url.split('/').filter((url) => url);
  const sameEl = item.url.split('/').filter((url) => url && pathname.split('/').includes(url));
  let urlMatch = false;
  if (sameEl.length >= urlList.length - 1) {
    let preUrl = '/';
    for (let i = 0; i < urlList.length - 1; i++) {
      preUrl += `${urlList[`${i}`]}/`;
    }
    // eslint-disable-next-line security/detect-non-literal-regexp
    let regexp = new RegExp(`^${preUrl}${item.subUrlRegex}$`, 'gi');
    urlMatch = regexp.test(pathname);
  }

  const isSelected = openItem.findIndex((url) => urlMatch && url === item.url) > -1;
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  // active menu item on page load
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (urlMatch) {
      dispatch(activeItem({ openItem: [item.url] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (anchorEl) {
      setAnchorEl(null);
    }
  }, [drawerOpen]);

  const openMini = Boolean(anchorEl);

  const textColor =
    theme.palette.mode === 'dark'
      ? 'grey.500'
      : menuMode === 'dark'
      ? alpha('#FFFFFF', 0.6)
      : 'text.primary';
  const iconSelectedColor =
    theme.palette.mode === 'dark'
      ? '#1FFBFB !important'
      : menuMode === 'dark'
      ? '#1FFBFB !important'
      : 'primary.main';

  const handleColor = (type) => {
    switch (menuMode) {
      case 'dark': {
        if (type === 'icon') {
          if (
            (topMenuUseYn === 'N' && isSelected && parentOpen) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return iconSelectedColor;
          } else {
            return `${textColor} !important`;
          }
        } else if (type === 'text') {
          if (
            (topMenuUseYn === 'N' && isSelected && parentOpen) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return iconSelectedColor;
          } else {
            return parentOpen ? 'white' : textColor;
          }
        }
        break;
      }
      case 'light': {
        if (type === 'icon') {
          if (
            (topMenuUseYn === 'N' && isSelected && parentOpen) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return '#008ABB !important';
          } else {
            return `${textColor} !important`;
          }
        } else if (type === 'text') {
          if (
            (topMenuUseYn === 'N' && isSelected && parentOpen) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return '#008ABB';
          } else {
            return textColor;
          }
        }
        break;
      }
      case 'gray': {
        if (type === 'icon') {
          if (
            (topMenuUseYn === 'N' && isSelected && parentOpen) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return '#008ABB !important';
          } else {
            return `${textColor} !important`;
          }
        } else if (type === 'text') {
          if (
            (topMenuUseYn === 'N' && isSelected && parentOpen) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return '#008ABB';
          } else {
            return textColor;
          }
        }
        break;
      }
    }
  };

  if (!item.label.includes('(hidden)'))
    return (
      <ListItemButton
        {...listItemProps}
        disabled={item.disabled}
        selected={isSelected}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 0.94, //메뉴리스트 위아래 패딩값
          ...(drawerOpen && {
            '&:hover': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'divider'
                  : menuMode === 'dark'
                  ? alpha('#ffffff', 0.05)
                  : 'primary.lighter',
            },
            '&.Mui-selected': {
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'divider'
                  : menuMode === 'dark'
                  ? alpha('#ffffff', 0.05)
                  : // ? 'transparent'
                  menuMode === 'gray'
                  ? '#e8ecfa'
                  : // : menuMode === 'light'
                    // ? '#f2f5ff'
                    'transparent',
              borderRight: menuMode === 'gray' && `2px solid #008ABB`, //좌측메뉴 타크모드에서는 없어야 함
              textDecoration:
                theme.palette.mode === 'dark' ? 'divider' : menuMode === 'light' && `underline`,
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'divider'
                    : menuMode === 'dark'
                    ? alpha('#ffffff', 0.05)
                    : 'primary.lighter',
              },
            },
          }),
          ...(!drawerOpen && {
            '&:hover': {
              bgcolor: 'transparent',
            },
            '&.Mui-selected': {
              '&:hover': {
                bgcolor: 'transparent',
              },
              bgcolor: 'transparent',
            },
          }),
        }}
      >
        {itemIcon && topMenuUseYn === 'Y' && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: handleColor('icon'),
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'secondary.light'
                      : menuMode === 'dark'
                      ? theme.palette.grey[500]
                      : 'secondary.lighter',
                },
              }),
              ...(!drawerOpen &&
                isSelected && {
                  bgcolor: theme.palette.mode === 'dark' ? 'primary.900' : 'primary.lighter',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.darker' : 'primary.lighter',
                  },
                }),
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{
                  color: handleColor('text'),
                  fontWeight: isSelected && 600,
                }}
              >
                {item.label}
              </Typography>
            }
          />
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
        {!drawerOpen && level === 1 && openMini && (
          <PopperStyled
            open={openMini}
            anchorEl={anchorEl}
            placement="right"
            style={{
              zIndex: 2001,
            }}
            menumode={menuMode}
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [-12, 1],
                  },
                },
              ],
            }}
          >
            {({ TransitionProps }) => (
              <Transitions in={openMini} {...TransitionProps}>
                <Paper
                  sx={{
                    overflow: 'hidden',
                    mt: 1.5,
                    boxShadow: theme.customShadows.z1,
                    backgroundImage: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor:
                      menuMode === 'dark' ? '#1e1e1e' : menuMode === 'gray' && '#F3F4F9',
                    cursor: 'pointer',
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          px: 1.25,
                          py: 1,
                          color: isSelected
                            ? menuMode === 'dark'
                              ? '#1FFBFB'
                              : 'primary.main'
                            : textColor,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </ClickAwayListener>
                </Paper>
              </Transitions>
            )}
          </PopperStyled>
        )}
      </ListItemButton>
    );
  else return null;
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
