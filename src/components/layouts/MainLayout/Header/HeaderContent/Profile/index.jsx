import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// next
import { useSession, signOut } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

// project import
import Avatar from '@components/@extended/Avatar';
import MainCard from '@components/mantis/MainCard';
import Transitions from '@components/@extended/Transitions';
import IconButton from '@components/@extended/IconButton';
import ProfileTab from './ProfileTab';
import useApi from '@modules/hooks/useApi';
import commonApi from '@api/common/commonApi';
import { AuthInstance } from '@modules/axios';
import { useTimerControl } from '@modules/hooks/useTimerControl';
import { useLogoutFlag } from '@modules/contexts/LogoutContext';

// assets
import { LogoutOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const intl = useIntl();

  commonApi.axios = AuthInstance({ headers: { 'X-Common': true } }).instance;

  const theme = useTheme();

  const { data: session } = useSession();

  const [apiCall, openModal] = useApi();

  const { disconnectSSE, connectSSE } = useTimerControl();
  const isLoggingOut = useLogoutFlag();

  const logout = async () => {
    isLoggingOut.current = true;
    disconnectSSE();
    try {
      await apiCall(commonApi.logoutUser, {
        accessSeq: session?.user?.accessSeq,
        userSeq: session?.user?.userSeq,
        accessToken: session?.accessToken,
        indexkey: Number(session?.indexKey),
      });
    } catch (error) {
      console.error('서버 로그아웃 실패', error);
    } finally {
      await signOut({ callbackUrl: '/common/login' });
    }
  };

  const handleLogout = () => {
    openModal({
      //message: '로그아웃 하시겠습니까?',
      message: intl.formatMessage({ id: 'components.index-confirm-logout' }),
      onConfirm: logout,
      close: true,
    });
  };

  const handleUserInfo = () => {
    // handleOpenWindow({
    //   url: `${window.location.origin}/manage/user/popup/userDetailPopup`,
    //   openName: 'userDetailPopup',
    //   width: '1420',
    //   height: '915',
    //   dataSet: {
    //     userSeq: session.user.userSeq,
    //   },
    // });
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (
      changePasswordOpen ||
      powerOpen ||
      (anchorRef.current && anchorRef.current.contains(event.target))
    ) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark' ? 'secondary.light' : 'secondary.lighter',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        {session.user && (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 0.25, px: 0.75 }}>
            <Avatar alt={session.user.name} sx={{ width: 30, height: 30 }} />
            <Typography variant="subtitle1"> {session.user.name}</Typography>
          </Stack>
        )}
      </ButtonBase>
      <Popper
        placement="bottom-end"
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
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          {session.user && (
                            <Stack direction="row" spacing={1.25} alignItems="center">
                              <Avatar alt={session.user.name} />
                              <Stack>
                                <Typography variant="h6">{session.user.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {session.user.permission}
                                </Typography>
                              </Stack>
                            </Stack>
                          )}
                        </Grid>
                        <Grid item>
                          <Tooltip
                            //title="로그아웃"
                            title={intl.formatMessage({ id: 'common.logout' })}
                          >
                            <IconButton
                              size="large"
                              sx={{ color: 'text.primary' }}
                              onClick={handleLogout}
                            >
                              <LogoutOutlined />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <ProfileTab
                        changePasswordOpen={changePasswordOpen}
                        setChangePasswordOpen={setChangePasswordOpen}
                        versionOpen={versionOpen}
                        setVersionOpen={setVersionOpen}
                        powerOpen={powerOpen}
                        setPowerOpen={setPowerOpen}
                        handleUserInfo={handleUserInfo}
                        handleLogout={handleLogout}
                      />
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
