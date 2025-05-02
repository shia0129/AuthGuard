import { useEffect, useMemo,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui

import { Box, useMediaQuery, Tabs, Tab, IconButton } from '@mui/material';

// project import
import Profile from './Profile';
import Notification from './Notification';
// import Customization from './Customization';
import Timer from './Timer';
import MobileSection from './MobileSection';
import MegaMenuSection from './MegaMenuSection';
import { setMenuItem, setSelectedTopMenu } from '@modules/redux/reducers/menu';
import { AreaChartOutlined } from '@ant-design/icons';
import usePopup from '@modules/hooks/usePopup';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const handleOpenWindow = usePopup();

  const dispatch = useDispatch();
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const megaMenu = useMemo(() => <MegaMenuSection />, []);
  const {
    selectedTopMenu,
    menuItem: { topItems },
  } = useSelector((state) => state.menu);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }

    if (Array.isArray(topItems)) {
      if (!selectedTopMenu && topItems.length !== 0) {
        dispatch(setSelectedTopMenu({ selectedTopMenu: topItems[0].menuId }));
      }
    }
  }, [topItems, selectedTopMenu]);
  const handleTabChange = (_, newValue) => {
    dispatch(setSelectedTopMenu({ selectedTopMenu: newValue }));
    dispatch(
      setMenuItem({ menuItem: topItems.find((topMenu) => topMenu.menuId === newValue).children }),
    );
  };

  return (
    <>
      {selectedTopMenu && typeof selectedTopMenu !== 'object' ? (
        <Tabs
          value={selectedTopMenu}
          onChange={handleTabChange}
          sx={{
            marginLeft: '25px',
            width: '100%',
            maxHeight: '48px',
            minHeight: '48px',
            '& span.MuiTabs-indicator': { height: '3px' },
            '& .MuiTabs-scroller': { marginTop: '5px' },
          }}
        >
          {topItems.map((item) => (
            <Tab key={item.menuId} label={item.label} value={item.menuId} />
          ))}
        </Tabs>
      ) : (
        <Box sx={{ width: '100%', ml: 1 }} />
      )}
      <Timer />
      <IconButton
        size="large"
        onClick={() => {
          handleOpenWindow({
            url: `/dashboard/dashboardPopup/`,
            openName: 'dashboardPopup',
            fullscreen:true,
          });
        }}
      >
        <AreaChartOutlined />
      </IconButton>

      {!matchesXs && megaMenu}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <Notification /> */}
      {/* <Customization /> */}
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
