import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from '@components/@extended/IconButton';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100'; // 선택시 바탕색
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.0'; // 바탕색

  // header content
  // common header
  const mainHeader = (
    <Toolbar variant="dense">
      <IconButton
        size="large"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        color="secondary"
        variant="light"
        sx={{
          marginLeft: '-5px !important',
          color: 'text.primary',
          // bgcolor: open ? iconBackColorOpen : iconBackColor,
          bgcolor: open ? iconBackColor : iconBackColorOpen,
          '&:hover': {
            bgcolor: iconBackColorOpen,
          },
          ml: { xs: 0, lg: 0 },
        }}
      >
        {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      // borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.customShadows.z1,
    },
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  navigation: PropTypes.object,
};

export default Header;
