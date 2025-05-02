// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// project import
import { drawerWidth } from 'src/config';

const openedMixin = (theme, menumode, mode) => ({
  width: drawerWidth,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    mode !== 'dark' && (menumode === 'dark' ? '#1E232E' : menumode === 'gray' && '#F3F4F9'), //20230410수정-일반사이즈일때 메뉴배경
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: theme.palette.mode === 'dark' ? theme.customShadows.z1 : 'none',
});

const closedMixin = (theme, menumode, mode) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(7.5),
  borderRight: 'none',
  backgroundColor:
    mode !== 'dark' && (menumode === 'dark' ? '#1E232E' : menumode === 'gray' && '#F3F4F9'), //20230410수정-일반사이즈일때 메뉴배경
  boxShadow: theme.customShadows.z1,
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, menumode, mode }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',

    ...(open && {
      ...openedMixin(theme, menumode, mode),
      '& .MuiDrawer-paper': openedMixin(theme, menumode, mode),
    }),
    ...(!open && {
      ...closedMixin(theme, menumode, mode),
      '& .MuiDrawer-paper': closedMixin(theme, menumode, mode),
    }),
  }),
);

export default MiniDrawerStyled;
