import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Box, Typography, Stack, Button, LinearProgress } from '@mui/material';
import { useIntl } from 'react-intl';
import {
  CancelPresentationOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  LinkOutlined,
  PowerSettingsNew,
} from '@mui/icons-material';

import { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import useRealTimeSslvaUsage from '@modules/hooks/useRealTimeSslvaUsage';
import SslvaInfoTopChart from '@components/hss/common/dashboardManage/sslvaInfoTopChart';
import SslvaDenyTopTable from '@components/hss/common/dashboardManage/sslvaDenyTopTable';
import SslvaAccessTopTable from '@components/hss/common/dashboardManage/sslvaAccessTopTable';

function SslvaDashboardPopup({ fullscreenFlag, renderFlag, setRenderFlag }) {
  const intl = useIntl();

  const monitorRef = useRef(null);

  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return <></>; // 로딩중
  }

  const { minuteUsage, hourlyUsage, dailyUsage } = useRealTimeSslvaUsage();

  const [daemonOn, setDaemonOn] = useState(true);
  const toggleDaemon = () => {
    setDaemonOn((prev) => !prev);
  };

  const COUNTDOWN_TIME = 60;
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleFullScreen = (elem) => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setRenderFlag((prev) => !prev);
      fullscreenFlag.current = true;
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setRenderFlag((prev) => !prev);
      fullscreenFlag.current = false;
    }
  };

  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRefreshing(true); // 갱신 트리거

          setTimeout(() => {
            setIsRefreshing(false); // true -> false로 리셋
          }, 100);

          return COUNTDOWN_TIME; // 리셋
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      //
    };
  }, []);

  return (
    <Box
      sx={{ display: 'flex', width: '100%', height: '100vh', flexDirection: 'column' }}
      ref={monitorRef}
    >
      <GridItem
        container
        direction="row"
        directionHorizon="space-between"
        directionVertical="center"
        sx={{ bgcolor: '#1E232E' }}
      >
        <GridItem item>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
            <Typography variant="title2" color="white">
              {/* SSL VA 모니터링 */}
              {intl.formatMessage({ id: 'monitoring.monitoring-sslva-title' })}
            </Typography>
            <Typography variant="body1" sx={{ color: '#aaa', ml: 2 }}>
              {/* ⏱ 1분마다 자동 갱신 (남은 시간: {countdown} 초) */}
              {intl.formatMessage(
                { id: 'monitoring.monitoring-system-refresh-desc' },
                { countdown: countdown },
              )}
            </Typography>
          </Box>
        </GridItem>

        <GridItem item sx={{ mr: 5, mt: 1 }}>
          {fullscreenFlag.current && (
            <FullscreenExitOutlined
              style={{ color: '#fff', fontSize: '30px', cursor: 'pointer', ml: 1 }}
              sx={{ ml: 1 }}
              onClick={() => {
                toggleFullScreen(document.body);
              }}
            />
          )}
          {!fullscreenFlag.current && (
            <FullscreenOutlined
              style={{ color: '#fff', fontSize: '30px', cursor: 'pointer', ml: 1 }}
              sx={{ ml: 1 }}
              onClick={() => {
                toggleFullScreen(document.body);
              }}
            />
          )}
          <CancelPresentationOutlined
            style={{ color: '#fff', fontSize: '30px', cursor: 'pointer', ml: 1 }}
            sx={{ ml: 1 }}
            onClick={() => {
              self.close();
            }}
          />
        </GridItem>
      </GridItem>
      <GridItem
        container
        direction="column"
        sx={{
          flexWrap: 'nowrap',
          p: 5,
          pt: 0,
          mt: 0,
          background: '#1F2B48',
          minHeight: 'calc(100vh - 46px)',
          minWidth: '1600px',
          color: '#fff',
        }}
        spacing={2}
      >
        {/* 첫번째 줄 시작 */}
        <GridItem item direction="row" spacing={1}>
          <GridItem item xs={8}>
            <Typography variant="h4" pl={1}>
              {/* 연결량 현황 */}
              {intl.formatMessage({ id: 'monitoring.monitoring-sslva-connection-status' })}
            </Typography>
            <MainCard
              sx={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                border: 0,
                mt: 1,
                height: '120px',
              }}
            >
              <GridItem container spacing={2} sx={{ flexWrap: 'nowrap' }}>
                <GridItem item xs={6} m={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <LinkOutlined style={{ color: '#fe8096', fontSize: '30px' }} />
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {/* 1분 연결량 */}
                        {intl.formatMessage({ id: 'monitoring.monitoring-sslva-connection-1min' })}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ color: '#fff', mt: 1 }}
                  >
                    <Typography
                      variant="h3"
                      // sx={{ cursor: 'pointer' }}
                      // onClick={() => {
                      //   openAlarmStatPopup('C');
                      // }}
                    >
                      {minuteUsage}
                    </Typography>
                    <Typography variant="h6" ml={0.5}>
                      건
                    </Typography>
                  </Stack>
                  {/* <Stack sx={{ color: '#3DFFDC', mt: 2 }}>
                    <LinearProgress variant="determinate" value={minuteUsage} color="inherit" />
                  </Stack> */}
                </GridItem>
                <GridItem item xs={6} m={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <LinkOutlined style={{ color: '#eec388', fontSize: '30px' }} />
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {/* 1시간 연결량 */}
                        {intl.formatMessage({ id: 'monitoring.monitoring-sslva-connection-1hour' })}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ color: '#fff', mt: 1 }}
                  >
                    <Typography
                      variant="h3"
                      // sx={{ cursor: 'pointer' }}
                      // onClick={() => {
                      //   openAlarmStatPopup('M');
                      // }}
                    >
                      {hourlyUsage}
                    </Typography>
                    <Typography variant="h6" ml={0.5}>
                      건
                    </Typography>
                  </Stack>
                  {/* <Stack sx={{ color: '#3DFFDC', mt: 2 }}>
                    <LinearProgress variant="determinate" value={hourlyUsage} color="inherit" />
                  </Stack> */}
                </GridItem>
                <GridItem item xs={6} m={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <LinkOutlined style={{ color: '#5bd4c5', fontSize: '30px' }} />
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {/* 1일 연결량 */}
                        {intl.formatMessage({ id: 'monitoring.monitoring-sslva-connection-1day' })}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="baseline"
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{ color: '#fff', mt: 1 }}
                  >
                    <Typography
                      variant="h3"
                      // sx={{ cursor: 'pointer' }}
                      // onClick={() => {
                      //   openAlarmStatPopup('N');
                      // }}
                    >
                      {dailyUsage}
                    </Typography>
                    <Typography variant="h6" ml={0.5}>
                      건
                    </Typography>
                  </Stack>
                  {/* <Stack sx={{ color: '#3DFFDC', mt: 2 }}>
                    <LinearProgress variant="determinate" value={dailyUsage} color="inherit" />
                  </Stack> */}
                </GridItem>
              </GridItem>
            </MainCard>
          </GridItem>
          <GridItem item xs={4}>
            <Typography variant="h4" pl={1}>
              {/* 서비스 상태 */}
              {intl.formatMessage({ id: 'monitoring.monitoring-sslva-service-status' })}
            </Typography>
            <MainCard
              sx={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                border: 0,
                mt: 1,
                height: '120px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Button
                  onClick={toggleDaemon}
                  startIcon={<PowerSettingsNew />}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: '24px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    backgroundColor: daemonOn ? '#43a047' : '#e53935',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: daemonOn ? '#388e3c' : '#c62828',
                      color: '#fff',
                    },
                    pointerEvents: 'none',
                  }}
                >
                  {daemonOn ? 'Daemon ON' : 'Daemon OFF'}
                </Button>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}
                >
                  {intl.formatMessage({ id: 'monitoring.monitoring-sslva-status-label' })}{' '}
                  {intl.formatMessage({
                    id: daemonOn
                      ? 'monitoring.monitoring-sslva-status-running'
                      : 'monitoring.monitoring-sslva-status-stopped',
                  })}
                </Typography>
              </Stack>
            </MainCard>
          </GridItem>
        </GridItem>
        {/* 첫번째 줄 끝 */}
        {/* 두번째 줄 시작 */}
        <GridItem item direction="row" spacing={1}>
          <GridItem item xs={12}>
            <MainCard
              sx={{
                background: '#000',
                //background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                border: 0,
                height: '230px',
                color: '#fff',
              }}
            >
              <GridItem container direction="column" spacing={1}>
                <GridItem item direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="title1" sx={{ color: '#fff' }}>
                    {/* 접속/종료 현황 */}
                    {intl.formatMessage({ id: 'monitoring.monitoring-sslva-connection-summary' })}
                  </Typography>
                </GridItem>
                <GridItem item>
                  <GridItem item sx={{ height: 170 }}>
                    <SslvaInfoTopChart isRefreshing={isRefreshing} />
                  </GridItem>
                </GridItem>
              </GridItem>
            </MainCard>
          </GridItem>
        </GridItem>
        {/* 두번째 줄 끝 */}
        {/* 세번째 줄 시작 */}
        <GridItem item direction="row" spacing={2}>
          <GridItem item xs={12}>
            <MainCard
              sx={{
                background: '#000',
                //background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                border: 0,
                height: fullscreenFlag?.current ? '280px' : '250px',
                color: '#fff',
              }}
            >
              <GridItem container direction="column" spacing={1}>
                <GridItem item direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="title1" sx={{ color: '#fff' }}>
                    {/* 장비 정보 TOP5 */}
                    {intl.formatMessage({ id: 'monitoring.monitoring-sslva-top-client-title' })}
                  </Typography>
                </GridItem>
                <GridItem item>
                  <GridItem item sx={{ height: 180 }}>
                    <SslvaDenyTopTable isRefreshing={isRefreshing} />
                  </GridItem>
                </GridItem>
              </GridItem>
            </MainCard>
          </GridItem>
          {/* 세번째 줄 끝 */}
          {/* 네번째 줄 시작 */}
          <GridItem item direction="row" spacing={2}>
            <GridItem item xs={12}>
              <MainCard
                sx={{
                  background: '#000',
                  //background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  border: 0,
                  height: fullscreenFlag?.current ? '280px' : '250px',
                  color: '#fff',
                }}
              >
                <GridItem container direction="column" spacing={1}>
                  <GridItem
                    item
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Typography variant="title1" sx={{ color: '#fff' }}>
                      {/* 접속 URL 순위 TOP5 */}
                      {intl.formatMessage({ id: 'monitoring.monitoring-sslva-top-url-title' })}
                    </Typography>
                  </GridItem>
                  <GridItem item>
                    <GridItem item sx={{ height: 180 }}>
                      <SslvaAccessTopTable isRefreshing={isRefreshing} />
                    </GridItem>
                  </GridItem>
                </GridItem>
              </MainCard>
            </GridItem>
          </GridItem>
          {/* 네번째 줄 끝 */}
        </GridItem>
      </GridItem>
    </Box>
  );
}

SslvaDashboardPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="monPopup" title="Sslva Dashboard">
      {page}
    </Layout>
  );
};

export default SslvaDashboardPopup;
