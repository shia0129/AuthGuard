import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { Box } from '@mui/material';

// project import
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';
import useConfig from '@modules/hooks/useConfig';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ open, handleDrawerToggle, window }) => {
  const { menuMode, mode } = useConfig();

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }} aria-label="mailbox folders">
      <MiniDrawerStyled variant="permanent" open={open} menumode={menuMode} mode={mode}>
        {drawerHeader}
        {drawerContent}
      </MiniDrawerStyled>
    </Box>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  window: PropTypes.object,
  handleDrawerToggle: PropTypes.func,
};

export default MainDrawer;
