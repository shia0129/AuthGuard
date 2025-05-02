import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import useConfig from '@modules/hooks/useConfig';
import Breadcrumbs from '@components/@extended/Breadcrumbs';
import { openDrawer, setTopMenuUseYn } from '@modules/redux/reducers/menu';
import Transitions from '@components/@extended/Transitions';
import PermissionGuard from '@modules/utils/route-guard/PermissionGuard';
import useApi from '@modules/hooks/useApi';
import preferencesApi from '@api/system/preferencesApi';
import { useSession } from 'next-auth/react';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));
  const dispatch = useDispatch();

  const { container, miniDrawer, fullSizeFlag } = useConfig();

  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;
  // api 호출 함수, openModal 함수.
  const [apiCall] = useApi();

  // drawer toggler
  const [open, setOpen] = useState(!miniDrawer || drawerOpen);

  const { data } = useSession();

  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  // set media wise responsive drawer
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (!miniDrawer) {
      setOpen(!matchDownLG);
      dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    }
  }, [matchDownLG]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0003.current){
        useEffect_0003.current = true;
        return; 
      } 
    }
    // 메뉴 설정 값 조회
    const getMenuConfig = async () => {
      const result = await apiCall(preferencesApi.getPreferences, {
        configType: 'MENU',
        hasToken: false,
      });
      if (result.status === 200) {
        const preference = result.data.find(
          (preference) => preference.configName === 'topMenuUseYn',
        );
        dispatch(setTopMenuUseYn({ topMenuUseYn: preference.configValue }));
      }
    };
    getMenuConfig();
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <PermissionGuard auth={children.type?.auth}>
        <Transitions type="fade" in={fullSizeFlag}>
          <Header open={open} handleDrawerToggle={handleDrawerToggle} />
        </Transitions>
        <Transitions type="collapse" orientation="horizontal" in={fullSizeFlag}>
          <Transitions type="fade" in={fullSizeFlag}>
            <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
          </Transitions>
        </Transitions>

        <Box
          component="main"
          sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}
        >
          <Transitions type="collapse" in={fullSizeFlag}>
            <Toolbar />
          </Transitions>

          {container && (
            <Container
              maxWidth="lg"
              sx={{
                px: { xs: 0, sm: 2 },
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Breadcrumbs
                title
                rightAlign
                titleBottom
                card={false}
                divider={false}
                sx={{ mb: '5px', mt: '-15px' }}
              />
              <Box id="portal" />
              <Box
                sx={{
                  minHeight: 'calc(100vh - 145px)',
                }}
              >
                {children}
              </Box>
              <Transitions type="collapse" in={fullSizeFlag} sx={{ mt: '5px' }} />
            </Container>
          )}
          {!container && (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Breadcrumbs
                title
                rightAlign
                card={false}
                divider={false}
                sx={{ mb: '5px', mt: '-15px' }}
              />
              <Box id="portal" />
              <Box
                sx={{
                  minHeight: 'calc(100vh - 145px)',
                }}
              >
                {children}
              </Box>
              <Transitions type="fade" in={fullSizeFlag} sx={{ mt: '5px' }} />
            </Box>
          )}
        </Box>
      </PermissionGuard>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
