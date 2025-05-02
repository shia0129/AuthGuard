import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
  Stack,
} from '@mui/material';

// project import
import MainCard from '@components/mantis/MainCard';
import IconButton from '@components/@extended/IconButton';
import Transitions from '@components/@extended/Transitions';
import useApi from '@modules/hooks/useApi';
import ButtonSet from '@components/modules/button/ButtonSet';

// assets
import { BellOutlined, SoundOutlined, CloseOutlined } from '@ant-design/icons';
// import notificationApi from '@api/system/notificationApi';
import { AuthInstance } from '@modules/axios';
import useConfig from '@modules/hooks/useConfig';
import { useRouter } from 'next/router';
import { setNotificationCnt, setNotificationList } from '@modules/redux/reducers/notification';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none',
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  // notificationApi.axios = AuthInstance();
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const { notificationTime } = useConfig();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState('');

  const dispatch = useDispatch();
  const notificationList = useSelector((state) => state.notification.notificationList);
  const notificationCnt = useSelector((state) => state.notification.notificationCnt);

  // openModal 함수.
  const [apiCall, openModal] = useApi();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // getNoticeList();
    // const timer = setInterval(async () => {
    //   getNoticeList();
    // }, notificationTime);
    // return () => clearInterval(timer);
  }, []);

  const getNoticeList = async () => {
    // const result = await apiCall(notificationApi.getNotificaionList);
    // if (result.status === 200 && result.data.resultData.length !== 0) {
    //   setUserId(result.data.resultData[0].userId);
    //   dispatch(setNotificationList({ notificationList: result.data.resultData }));
    //   dispatch(setNotificationCnt({ notificationCnt: result.data.total }));
    // }
  };

  const timeConvert = (date) => {
    let hh = date.slice(8, 10);
    let mm = date.slice(10, 12);
    let ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh >= 12 ? hh - 12 : hh - 0;
    timeCalc(date);
    return hh + ':' + mm + ' ' + ampm;
  };

  const timeCalc = (date) => {
    const yyyy = date.slice(0, 4);
    const MM = date.slice(4, 6);
    const dd = date.slice(6, 8);
    const hh = date.slice(8, 10);
    const mm = date.slice(10, 12);
    const ss = date.slice(12, 14);
    const nowDate = new Date();
    const date2 = new Date(yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss);

    const diffDate = nowDate - date2;

    if (diffDate >= 1000 * 60 * 60 * 24) {
      return Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24))) + '일 전';
    } else if (diffDate >= 1000 * 60 * 60) {
      return Math.floor(Math.abs(diffDate / (1000 * 60 * 60))) + '시간 전';
    } else if (diffDate >= 1000 * 60) {
      return Math.floor(Math.abs(diffDate / (1000 * 60))) + '분 전';
    } else {
      return Math.floor(Math.abs(diffDate / 1000)) + '초 전';
    }
  };

  // 알림내용 클릭시
  const notificationClick = async (noticeId, url, notificationId, userId) => {
    // const notiDelYn = await apiCall(notificationApi.getNotiDeleteChk, noticeId);
    // if (notiDelYn.status === 200) {
    //   if (notiDelYn.data === 'Y') {
    //     openModal({
    //       message: '이미 삭제된 공지사항입니다.',
    //     });
    //   } else {
    //     router.push({
    //       pathname: url[0],
    //       query: url[1],
    //     });
    //   }
    //   notificationApi.readNotification(notificationId, userId);
    // }
  };

  // 전체읽음 클릭시
  const readAllBtnClick = async () => {
    // const result = await apiCall(notificationApi.readAllNotification, userId);

    // if (result.status === 200 && result.data > 0) {
    //   openModal({
    //     message: '전체읽음 처리 되었습니다.',
    //   });
    // }
    getNoticeList();
  };

  // 읽은알림 삭제 클릭시
  const readDeleteBtnClick = async () => {
    // const result = await apiCall(notificationApi.updateReadNotiDel, userId);

    // if (result.status === 200 && result.data > 0) {
    //   openModal({
    //     message: '읽은알림 삭제처리 되었습니다.',
    //   });
    // }
    getNoticeList();
  };

  // 알림 개별삭제
  const updateIndividualDel = async (notificationId, userId) => {
    // const result = await apiCall(notificationApi.updateIndividualDel, { notificationId, userId });

    // if (result.status === 200 && result.data > 0) {
    //   openModal({
    //     message: '알림 삭제처리 되었습니다.',
    //   });
    // }
    getNoticeList();
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.100'; // 선택시 바탕색
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.0'; // 바탕색

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        size="large"
        color="secondary"
        variant="light"
        sx={{
          color: 'text.primary',
          bgcolor: open ? iconBackColorOpen : iconBackColor,
          '&:hover': {
            bgcolor: iconBackColorOpen,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        {notificationCnt !== 0 ? (
          <Badge badgeContent={notificationCnt} color="primary">
            <BellOutlined />
          </Badge>
        ) : (
          <Badge badgeContent="0" color="primary">
            <BellOutlined />
          </Badge>
        )}
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
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
                offset: [matchesXs ? -5 : 0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 400,
                maxWidth: 500,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="전체 알림"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <ButtonSet
                      size="extraSmall"
                      sx={{
                        '& button:nth-of-type(2)': { minWidth: '90px' },
                      }}
                      options={[
                        {
                          label: '전체읽음',
                          callBack: () => readAllBtnClick(),
                        },
                        {
                          label: '읽은알림 삭제',
                          callBack: () => readDeleteBtnClick(),
                        },
                      ]}
                    />
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      maxHeight: 300,
                      p: 0,
                      overflow: 'auto',
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
                      },
                    }}
                  >
                    {notificationList.length !== 0 ? (
                      notificationList.map((notification, i) => (
                        <Fragment key={i}>
                          <Stack
                            sx={{
                              bgcolor: notification.readYn === 'Y' ? 'grey.50' : '#fff',
                              flexDirection: 'row',
                              alignItems: 'center',
                              borderBottom: 'solid 1px #f0f0f0',
                            }}
                          >
                            <ListItemButton
                              onClick={() => {
                                const url = notification.url.split('?');

                                notificationClick(
                                  notification.noticeId,
                                  url,
                                  notification.notificationId,
                                  notification.userId,
                                );
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    color: 'success.main',
                                    bgcolor: 'success.lighter',
                                  }}
                                >
                                  <SoundOutlined />
                                  {/* 사용자권한변경 <UserSwitchOutlined /> */}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <>
                                    <Typography variant="h6">
                                      <Typography component="span" variant="subtitle1">
                                        {'[ ' + notification.category + '알림 ]'}
                                      </Typography>
                                    </Typography>
                                    <Typography component="span" variant="subtitle1">
                                      {notification.content}
                                    </Typography>
                                  </>
                                }
                                secondary={timeCalc(notification.registerDate)}
                              />
                              <ListItemSecondaryAction>
                                <Typography variant="caption" noWrap>
                                  {timeConvert(notification.registerDate)}
                                </Typography>
                              </ListItemSecondaryAction>
                            </ListItemButton>
                            <IconButton
                              sx={{
                                marginRight: '8px',
                                fontSize: '0.7rem',
                                width: '20px',
                                color: '#b5b5b5',
                                '&:hover': { backgroundColor: '#fff0' },
                              }}
                              onClick={() =>
                                updateIndividualDel(
                                  notification.notificationId,
                                  notification.userId,
                                )
                              }
                            >
                              <CloseOutlined />
                            </IconButton>

                            <Divider />
                          </Stack>
                        </Fragment>
                      ))
                    ) : (
                      <ListItemText
                        primary={
                          <Typography variant="h6" align="center">
                            최근 알림이 없습니다.
                          </Typography>
                        }
                      />
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
