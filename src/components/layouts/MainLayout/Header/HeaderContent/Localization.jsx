import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
} from '@mui/material';

// project import
import IconButton from '@components/@extended/IconButton';
import Transitions from '@components/@extended/Transitions';
import useConfig from '@modules/hooks/useConfig';
// import preferencesApi from '@api/system/preferencesApi';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';

// assets
import { TranslationOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - LOCALIZATION ||============================== //

const Localization = () => {
  // preferencesApi.axios = AuthInstance();

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  // api 호출 함수
  const [apiCall] = useApi();

  const { i18n, onChangeLocalization } = useConfig();

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (lang) => {
    updateLocaleConfig(lang);
    onChangeLocalization(lang);
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  // LOCALE Config Id
  const [configId, setConfigId] = useState(null);

  // Locale 설정 값 조회
  const getLocaleConfig = async () => {
    // const result = await apiCall(preferencesApi.getPreferences, 'LOCALE');
    // if (result.status === 200) {
    //   const { configId, configValue } = result.data[0];
    //   onChangeLocalization(configValue);
    //   setConfigId(configId);
    // }
  };

  // Locale 설정 값 수정
  const updateLocaleConfig = async (lang) => {
    // const result = await apiCall(preferencesApi.updatePreferences, { configId, configValue: lang });
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    getLocaleConfig();
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        size="large"
        color="secondary"
        variant="light"
        aria-label="open localization"
        ref={anchorRef}
        aria-controls={open ? 'localization-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
      >
        <TranslationOutlined />
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom-start' : 'bottom'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 0 : 0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  component="nav"
                  sx={{
                    p: 0,
                    width: '100%',
                    minWidth: 200,
                    maxWidth: 290,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 0.5,
                    [theme.breakpoints.down('md')]: {
                      maxWidth: 250,
                    },
                  }}
                >
                  <ListItemButton
                    selected={i18n === 'en'}
                    onClick={() => handleListItemClick('en')}
                  >
                    <ListItemText
                      primary={
                        <Grid container>
                          <Typography color="textPrimary">English</Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                            (UK)
                          </Typography>
                        </Grid>
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    selected={i18n === 'ko'}
                    onClick={() => handleListItemClick('ko')}
                  >
                    <ListItemText
                      primary={
                        <Grid container>
                          <Typography color="textPrimary">한국어</Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                            (Korean)
                          </Typography>
                        </Grid>
                      }
                    />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Localization;
