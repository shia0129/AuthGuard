import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Box, Typography, Stack } from '@mui/material';
import MiniTable from '@components/modules/table/MiniTable';
import { useIntl } from 'react-intl';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  CancelPresentationOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  SpeedOutlined,
  MemoryOutlined,
  StorageOutlined,
  AccessTimeOutlined,
} from '@mui/icons-material';

import { useRealtimeSystemInfo } from '@modules/hooks/useRealtimeSystemInfo';
import SystemRealtimeCharts from '@components/hss/common/dashboardManage/systemRealtimeCharts';

import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import dashboardApi from '@api/hss/common/systemManage/dashboardApi';
import interfaceApi from '@api/hss/common/networkManage/interfaceApi';
import LoadingButton from '@components/modules/button/LoadingButton';

const columnData1 = [
  {
    date: '2025.04.15 13:58:00',
    adminId: 'admin1',
    accessIp: '192.168.1.1',
    loginLogout: '로그인',
  },
  {
    date: '2025.04.15 12:50:00',
    adminId: 'admin23',
    accessIp: '192.168.1.9',
    loginLogout: '로그아웃',
  },
  {
    date: '2025.04.15 12:45:00',
    adminId: 'admin08',
    accessIp: '192.168.1.5',
    loginLogout: '로그인',
  },
  {
    date: '2025.04.15 12:30:00',
    adminId: 'admin23',
    accessIp: '192.168.1.2',
    loginLogout: '로그인',
  },
  {
    date: '2025.04.15 12:00:00',
    adminId: 'admin01',
    accessIp: '192.168.1.2',
    loginLogout: '로그아웃',
  },
  {
    date: '2025.04.15 11:00:00',
    adminId: 'admin01',
    accessIp: '192.168.1.2',
    loginLogout: '로그인',
  },
];

function SystemDashboardPopup({ fullscreenFlag, renderFlag, setRenderFlag }) {
  const intl = useIntl();

  const column1 = [
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-date' }),
      id: 'date',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '50px', maxWidth: '50px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-admin-id' }),
      id: 'adminId',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-ip' }),
      id: 'accessIp',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '150px', maxWidth: '150px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-login-status' }),
      id: 'loginLogout',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '50px', maxWidth: '50px' },
    },
  ];

  const zoneColumns = [
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-service-name' }),
      id: 'name',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-status' }),
      id: 'status',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
  ];

  const interfaceColumns = [
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-interface-name' }),
      id: 'name',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-type' }),
      id: 'type',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '80px', maxWidth: '80px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-external' }),
      id: 'external',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '80px', maxWidth: '80px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-table-ip-address' }),
      id: 'ip',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
  ];

  const monitorRef = useRef(null);
  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return <></>; // 로딩중
  }

  const { instance, source } = AuthInstance();
  const [apiCall] = useApi();

  dashboardApi.axios = instance;
  interfaceApi.axios = instance;

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const { cpu, memory, disk, uptime } = useRealtimeSystemInfo();

  const [zoneList, setZoneList] = useState([]);
  const [interfaceList, setInterfaceList] = useState([]);
  const [hasZoneData, setHasZoneData] = useState(false);
  const [hasInterfaceData, setHasInterfaceData] = useState(false);
  const [hasAdminLoginData, setHasAdminLoginData] = useState(false);

  const COUNTDOWN_TIME = 60;
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSystemInfo = useCallback(
    async (signal) => {
      // 로딩 상태 초기화
      setHasZoneData(false);
      setHasInterfaceData(false);
      setHasAdminLoginData(false);

      try {
        const [zoneRes, interfaceRes] = await Promise.all([
          apiCall(dashboardApi.getServiceStatus, { hasToken: false, signal }),
          apiCall(interfaceApi.getInterfaceList, { contentOnly: true, signal }),
        ]);

        // 서비스 상태 처리
        if (zoneRes?.status === 200) {
          const zoneListData = zoneRes.data.map((item) => ({
            name: item.name,
            status: intl.formatMessage({
              id:
                item.enabled === '1'
                  ? 'monitoring.monitoring-status-active'
                  : 'monitoring.monitoring-status-inactive',
            }),
          }));
          setZoneList(zoneListData);
        }

        // 인터페이스 목록 처리
        if (Array.isArray(interfaceRes)) {
          const interfaceListData = interfaceRes.map((item) => ({
            name: item.name ?? '-',
            type: item.type ?? '-',
            external: '-', // 외부연동 판단 로직 필요
            ip: item.ip ?? '-',
          }));
          setInterfaceList(interfaceListData);
        }
      } catch (err) {
        console.error('시스템 정보를 불러오는 중 오류 발생:', err);
      }

      // 로딩 완료 표시
      setHasZoneData(true);
      setHasInterfaceData(true);
      setHasAdminLoginData(true);
    },
    [apiCall],
  );

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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isRefreshing) {
      fetchSystemInfo();
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    fetchSystemInfo();

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
      source.cancel();
    };
  }, []);

  const DiskDisplay = ({ diskInfo }) => {
    return (
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Box>
          <Typography variant="h3" sx={{ lineHeight: 1 }}>
            {diskInfo?.total?.toFixed(1) || '0'}
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: 1 }}>
            GiB Total
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" sx={{ lineHeight: 1 }}>
            {diskInfo?.used?.toFixed(1) || '0'}
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: 1 }}>
            GiB Used
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" sx={{ lineHeight: 1 }}>
            {diskInfo?.avail?.toFixed(1) || '0'}
          </Typography>
          <Typography variant="caption" sx={{ lineHeight: 1 }}>
            GiB Free
          </Typography>
        </Box>
        {/* <Box>
            <Typography variant="h3" sx={{ lineHeight: 1 }}>
              {diskInfo?.usagePercent ? diskInfo.usagePercent + '%' : '0%'}
            </Typography>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              Usage
            </Typography>
          </Box> */}
      </Stack>
    );
  };

  const UptimeDisplay = ({ uptimeInSeconds }) => {
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    return (
      <Stack direction="row" spacing={0.5} alignItems="baseline">
        {days > 0 && (
          <>
            <Typography variant="h3">{days}</Typography>
            <Typography variant="caption">d</Typography>
          </>
        )}
        <Typography variant="h3">{hours}</Typography>
        <Typography variant="caption">h</Typography>
        <Typography variant="h3" sx={{ ml: 1 }}>
          {minutes}
        </Typography>
        <Typography variant="caption">m</Typography>
        <Typography variant="h3" sx={{ ml: 1 }}>
          {seconds}
        </Typography>
        <Typography variant="caption">s</Typography>
      </Stack>
    );
  };

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
              {/* 시스템 모니터링 */}
              {intl.formatMessage({ id: 'monitoring.monitoring-system-title' })}
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
        {/* 테스트 줄 시작 */}
        {/* 테스트 줄 끝 */}
        {/* 첫번째 줄 시작 */}
        <GridItem item direction="row" spacing={1}>
          <GridItem item xs={12}>
            <Typography variant="h4" pl={1}>
              {/* 시스템 자원 사용 현황 */}
              {intl.formatMessage({ id: 'monitoring.monitoring-system-resource-status' })}
            </Typography>
            <GridItem item direction="row" spacing={1}>
              <GridItem item xs={3}>
                <MainCard
                  sx={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    border: 0,
                    mt: 1,
                    height: '125px',
                    color: '#fff',
                  }}
                >
                  <GridItem item m={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <SpeedOutlined sx={{ color: '#fff', fontSize: '30px' }} />
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {/* CPU 사용량 */}
                          {intl.formatMessage({ id: 'monitoring.monitoring-system-cpu' })}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="baseline"
                      justifyContent="flex-end"
                      spacing={1}
                      sx={{
                        mt: 1,
                        color: cpu >= 80 ? '#f44336' : '#fff', // #f44336: red,
                      }}
                    >
                      <Typography variant="h3">{cpu}</Typography>
                      <Typography variant="h6" ml={0.5}>
                        %
                      </Typography>
                    </Stack>
                  </GridItem>
                </MainCard>
              </GridItem>
              <GridItem item xs={3}>
                <MainCard
                  sx={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    border: 0,
                    mt: 1,
                    height: '125px',
                    color: '#fff',
                  }}
                >
                  <GridItem item m={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <MemoryOutlined sx={{ color: '#fff', fontSize: '30px' }} />
                      <Stack direction="row" alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#fff',
                          }}
                        >
                          {/* MEM 사용량 */}
                          {intl.formatMessage({ id: 'monitoring.monitoring-system-memory' })}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="baseline"
                      justifyContent="flex-end"
                      spacing={1}
                      sx={{
                        mt: 1,
                        color: memory >= 80 ? '#f44336' : '#fff', // #f44336: red,
                      }}
                    >
                      <Typography variant="h3">{memory}</Typography>
                      <Typography variant="h6" ml={0.5}>
                        %
                      </Typography>
                    </Stack>
                  </GridItem>
                </MainCard>
              </GridItem>
              <GridItem item xs={3}>
                <MainCard
                  sx={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    border: 0,
                    mt: 1,
                    height: '125px',
                    color: '#fff',
                  }}
                >
                  <GridItem item m={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <StorageOutlined sx={{ color: '#fff', fontSize: '30px' }} />
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {/* DISK 사용량 */}
                          {intl.formatMessage({ id: 'monitoring.monitoring-system-disk' })}
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
                      <DiskDisplay diskInfo={disk} />
                    </Stack>
                  </GridItem>
                </MainCard>
              </GridItem>
              <GridItem item xs={3}>
                <MainCard
                  sx={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '10px',
                    border: 0,
                    mt: 1,
                    height: '125px',
                    color: '#fff',
                  }}
                >
                  <GridItem item m={1}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <AccessTimeOutlined sx={{ color: '#fff', fontSize: '30px' }} />
                      <Stack direction="row" alignItems="center">
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {/* UPTIME */}
                          {intl.formatMessage({ id: 'monitoring.monitoring-system-uptime' })}
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
                      <UptimeDisplay uptimeInSeconds={uptime} />
                    </Stack>
                  </GridItem>
                </MainCard>
              </GridItem>
            </GridItem>
          </GridItem>
        </GridItem>
        {/* 첫번째 줄 끝 */}
        {/* 두번째 줄 시작 */}
        <SystemRealtimeCharts />
        {/* 두번째 줄 끝 */}
        {/* 세번째 줄 시작 */}
        <GridItem item direction="row" spacing={1}>
          <GridItem item xs={6}>
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
              <GridItem item direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="title1">
                  {/* 서비스 상태 */}
                  {intl.formatMessage({ id: 'monitoring.monitoring-system-service-status' })}
                </Typography>
                {/* <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                      onClick={() => router.push('/hss/networkManage/interfaceManage')}
                    >
                      + 더보기
                    </Typography> */}
              </GridItem>
              <GridItem item mt={1}>
                {hasZoneData ? (
                  <MiniTable
                    maxHeight={fullscreenFlag?.current ? '210px' : '180px'}
                    columns={zoneColumns}
                    data={zoneList}
                    onlyDark
                    // ellipsis
                    outlineBorder
                  />
                ) : (
                  <LoadingButton loadingPosition="center" color="secondary" loading />
                )}
                {/* {isLoading ? <LoadingButton loadingPosition="center" color='secondary' loading /> : */}
              </GridItem>
            </MainCard>
          </GridItem>
          <GridItem item xs={6}>
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
              <GridItem item direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="title1">
                  {/* 네트워크 */}
                  {intl.formatMessage({ id: 'monitoring.monitoring-system-network' })}
                </Typography>
                {/* <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                      onClick={() => router.push('/hss/networkManage/interfaceManage')}
                    >
                      + 더보기
                    </Typography> */}
              </GridItem>
              <GridItem item mt={1}>
                {hasInterfaceData ? (
                  <MiniTable
                    maxHeight={fullscreenFlag?.current ? '210px' : '180px'}
                    columns={interfaceColumns}
                    data={interfaceList}
                    onlyDark
                    // ellipsis
                    outlineBorder
                  />
                ) : (
                  <LoadingButton loadingPosition="center" color="secondary" loading />
                )}
                {/* {isLoading ? <LoadingButton loadingPosition="center" color='secondary' loading /> : */}
              </GridItem>
            </MainCard>
          </GridItem>
        </GridItem>
        {/* 세번째 줄 끝 */}
        {/* 네번째 줄 시작 */}
        <GridItem item direction="column" spacing={1}>
          <GridItem item>
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
              <GridItem item direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="title1">
                  {/* 관리자 로그인/로그아웃 현황 */}
                  {intl.formatMessage({ id: 'monitoring.monitoring-system-admin-login-status' })}
                </Typography>
                {/* <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                  onClick={() => router.push('/hss/networkManage/interfaceManage')}
                >
                  + 더보기
                </Typography> */}
              </GridItem>
              <GridItem item mt={1}>
                {hasAdminLoginData ? (
                  <MiniTable
                    maxHeight={fullscreenFlag?.current ? '210px' : '180px'}
                    columns={column1}
                    data={columnData1}
                    onlyDark
                    // ellipsis
                    outlineBorder
                  />
                ) : (
                  <LoadingButton loadingPosition="center" color="secondary" loading />
                )}
                {/* {isLoading ? <LoadingButton loadingPosition="center" color='secondary' loading /> : */}
              </GridItem>
              {/* <GridItem container direction="column" spacing={1}></GridItem> */}
            </MainCard>
          </GridItem>
        </GridItem>
        {/* 네번째 줄 끝 */}
      </GridItem>
    </Box>
  );
}

SystemDashboardPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="monPopup" title="System Dashboard">
      {page}
    </Layout>
  );
};

export default SystemDashboardPopup;
