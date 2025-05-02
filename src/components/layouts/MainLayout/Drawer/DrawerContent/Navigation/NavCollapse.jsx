import PropTypes from 'prop-types';
import { useEffect, useState,useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { alpha } from '@mui/material/styles';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Collapse,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
  Divider,
} from '@mui/material';

// project import
import NavItem from './NavItem';
import Transitions from '@components/@extended/Transitions';
import { iconMap } from '@modules/common/menuParser';
import useConfig from '@modules/hooks/useConfig';
import { setSelectedCollapse } from '@modules/redux/reducers/menu';

// assets
import { DownOutlined, UpOutlined, FormOutlined } from '@ant-design/icons';

// mini-menu - wrapper
const PopperStyled = styled(Popper)(({ theme, menumode }) => ({
  overflow: 'visible',
  zIndex: 1202,
  minWidth: 180,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 38,
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
    borderLeft: `1px solid ${theme.palette.grey.A800}`,
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
  },
}));

// ==============================|| NAVIGATION - LIST COLLAPSE ||============================== //

const NavCollapse = ({ menu, level, parentOpen }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const menuState = useSelector((state) => state.menu);
  const { drawerOpen, selectedCollapse, topMenuUseYn } = menuState;
  const { menuMode } = useConfig();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(null);
    if (drawerOpen) {
      setOpen(!open);
      setSelected(!selected ? menu.url : null);
      if (menu.type === 'group') {
        let collapse;
        if (!selectedCollapse || selectedCollapse !== menu.url) {
          collapse = menu.url;
        } else if (selectedCollapse === menu.url) {
          collapse = null;
        }

        dispatch(setSelectedCollapse({ selectedCollapse: collapse }));
      }
    } else {
      setAnchorEl(event?.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let currentPath = document.location.pathname;
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (menu.children) {
      menu.children.forEach((item) => {
        const urlList = item.url.split('/').filter((url) => url);
        const sameEl = item.url
          .split('/')
          .filter((url) => url && currentPath.split('/').includes(url));
        if (
          (item.type === 'item' && item.url === currentPath) ||
          (item.type === 'collapse' && urlList.length === sameEl.length)
        ) {
          setOpen(true);
          setSelected(menu.url);
        }
      });
    }
  }, [currentPath]);

  const isSelected = menu.type !== 'group' ? selected === menu.url : selectedCollapse === menu.url;
  const isOpen = menu.type !== 'group' ? open : selectedCollapse === menu.url;

  const textColor =
    theme.palette.mode === 'dark'
      ? alpha('#FFFFFF', 0.6)
      : menuMode === 'dark'
      ? alpha('#FFFFFF', 0.6)
      : menuMode === 'gray'
      ? theme.palette.grey[600]
      : 'text.primary';
  const iconSelectedColor =
    theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.main;

  const handleColor = (type) => {
    switch (menuMode) {
      case 'dark': {
        if (type === 'icon') {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isSelected && parentOpen) ||
                (menu.type === 'group' && (isSelected || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return 'white !important';
          } else {
            return `${textColor} !important`;
          }
        } else if (type === 'text') {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isOpen && parentOpen) ||
                (menu.type === 'group' && (isOpen || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isOpen)
          ) {
            return 'white';
          } else {
            return textColor;
          }
        } else {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isOpen && parentOpen) ||
                (menu.type === 'group' && (isOpen || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isOpen)
          ) {
            return 'white';
          } else {
            return textColor;
          }
        }
      }
      case 'light': {
        if (type === 'icon') {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isSelected && parentOpen) ||
                (menu.type === 'group' && (isSelected || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return `${theme.palette.grey[900]} !important`;
          } else {
            return `${textColor} !important`;
          }
        } else if (type === 'text') {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isOpen && parentOpen) ||
                (menu.type === 'group' && (isOpen || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isOpen)
          ) {
            return theme.palette.grey[900];
          } else {
            return textColor;
          }
        } else {
          return theme.palette.grey[900];
        }
      }
      case 'gray': {
        if (type === 'icon') {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isSelected && parentOpen) ||
                (menu.type === 'group' && (isSelected || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isSelected)
          ) {
            return '#008ABB !important';
          } else {
            return `${textColor} !important`;
          }
        } else if (type === 'text') {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isOpen && parentOpen) ||
                (menu.type === 'group' && (isOpen || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isOpen)
          ) {
            return '#008ABB';
          } else {
            return textColor;
          }
        } else {
          if (
            (topMenuUseYn === 'N' &&
              ((menu.type !== 'group' && isOpen && parentOpen) ||
                (menu.type === 'group' && (isOpen || parentOpen)))) ||
            (topMenuUseYn === 'Y' && isOpen)
          ) {
            return '#008ABB';
          } else {
            return textColor;
          }
        }
      }
    }
  };

  const openMini = Boolean(anchorEl);

  const navCollapse = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.url} menu={item} level={level + 1} parentOpen={isOpen} />;
      case 'item':
        return <NavItem key={item.url} item={item} level={level + 1} parentOpen={isOpen} />;
      default:
        return (
          <Typography key={item.url} variant="h6" color="error" align="center">
            Fix - Collapse or Item
          </Typography>
        );
    }
  });

  const borderIcon = level === 1 ? <FormOutlined /> : false;
  const Icon = iconMap(menu.icon);
  const menuIcon = iconMap(menu.icon) ? (
    <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
  ) : (
    borderIcon
  );

  if (!menu.label.includes('(hidden)'))
    return (
      <>
        <ListItemButton
          disableRipple
          selected={isSelected}
          {...(!drawerOpen && { onMouseEnter: handleClick, onMouseLeave: handleClose })}
          onClick={handleClick}
          sx={{
            pl: drawerOpen ? `${level * 28}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
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
                  menuMode === 'dark' && menu.type === 'collapse'
                    ? 'rgba(140,202,235,0.2)'
                    : 'transparent',
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'divider'
                      : menuMode === 'dark'
                      ? 'rgba(140,202,235,0.2)'
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
          {menuIcon && (topMenuUseYn === 'Y' ? true : menu.type === 'group') && (
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
                        ? '#8c8c8c'
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
              {menuIcon}
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography variant="h6" color={handleColor('text')}>
                  {menu.label}
                </Typography>
              }
              secondary={
                menu.caption && (
                  <Typography variant="caption" color="secondary">
                    {menu.caption}
                  </Typography>
                )
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) &&
            (openMini || isOpen ? (
              <UpOutlined
                style={{
                  fontSize: '0.625rem',
                  marginLeft: 1,
                  color: handleColor(),
                }}
              />
            ) : (
              <DownOutlined
                style={{
                  fontSize: '0.625rem',
                  marginLeft: 1,
                  color: handleColor(),
                }}
              />
            ))}
          {!drawerOpen && (
            <PopperStyled
              open={openMini}
              anchorEl={anchorEl}
              placement="right-start"
              menumode={menuMode}
              style={{
                zIndex: 2001,
              }}
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
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            px: 1.25,
                            py: 1,
                            color: isSelected ? menuMode === 'dark' && 'white' : textColor,
                          }}
                        >
                          {menu.label}
                        </Typography>
                        <Divider sx={{ borderColor: 'grey.300', width: '100%' }} />
                        {navCollapse}
                      </Box>
                    </ClickAwayListener>
                  </Paper>
                </Transitions>
              )}
            </PopperStyled>
          )}
        </ListItemButton>
        {drawerOpen && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List
              sx={{
                p: 0,
                backgroundColor:
                  menuMode === 'dark' && menu.type === 'collapse' && 'rgba(140,202, 235,0.12)',
              }}
            >
              {navCollapse}
            </List>
          </Collapse>
        )}
      </>
    );
  else return null;
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
};

export default NavCollapse;
