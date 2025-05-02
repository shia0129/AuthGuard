// 표 색 흰색으로 바꿔야 함

'use client';
import React from 'react';

import { useEffect, useState, useCallback, useRef } from 'react';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Stack, Typography, Box, Grid, Button, Switch } from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import MiniTable from '@components/modules/table/MiniTable';
import dashboardApi from '@api/hss/common/systemManage/dashboardApi';
import LoadingButton from '@components/modules/button/LoadingButton';
import Loader from '@components/mantis/Loader';

const column1 = [
  {
    label: 'OS명',
    id: 'osName',
    options: { textAlign: 'center', cell: { width: '70%' } },
    headerOptions: { width: '70%' },
  },
  {
    label: 'OS 버전',
    id: 'version',
    options: { textAlign: 'center', cell: { width: '30%' } },
    headerOptions: { width: '30%' },
  },
];

const column2 = [
  {
    label: '커널 버전',
    id: 'version',
    options: { textAlign: 'center' },
  },
];

const column3 = [
  {
    label: '패키지명',
    id: 'packageName',
    options: { textAlign: 'center', cell: { width: '70%' } },
    headerOptions: { width: '70%' },
  },
  {
    label: '패키지 버전',
    id: 'version',
    options: { textAlign: 'center', cell: { width: '30%' } },
    headerOptions: { width: '30%' },
  },
];

const column4 = [
  {
    label: '세그먼트명',
    id: 'vaName',
    options: { textAlign: 'center', cell: { width: '40%' } },
    headerOptions: { width: '40%' },
  },
  {
    label: 'VA',
    id: 'vaVersion',
    options: { textAlign: 'center', cell: { width: '30%' } },
    headerOptions: { width: '30%' },
  },
  {
    label: 'SWG',
    id: 'swgVersion',
    options: { textAlign: 'center', cell: { width: '30%' } },
    headerOptions: { width: '30%' },
  },
];

const column5 = [
  {
    label: '파일명',
    id: 'fileName',
    options: { textAlign: 'center', cell: { width: '85%' } },
    headerOptions: { width: '85%' },
  },
  {
    label: '상태',
    id: 'fileStatus',
    render: (value) => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: value === 'PASS' ? '#43a047' : '#e53935',
            '&:hover': {
              backgroundColor: value === 'PASS' ? '#388e3c' : '#c62828',
            },
            color: '#fff',
            fontSize: '0.6rem',
            width: 60,
            height: 20,
            padding: '0 6px',
            borderRadius: '16px',
            lineHeight: 1,
            // 클릭 비활성화
            pointerEvents: 'none',
            userSelect: 'none',
            cursor: 'default',
          }}
        >
          {value}
        </Button>
      </Box>
    ),
    options: { textAlign: 'center', cell: { width: '15%' } },
    headerOptions: { width: '15%' },
  },
];

const column6 = [
  {
    label: '프로세스명',
    id: 'proccessName',
    options: { textAlign: 'center', cell: { width: '85%' } },
    headerOptions: { width: '85%' },
  },
  {
    label: '상태',
    id: 'proccessStatus',
    render: (value) => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Switch
          checked={value === 'ON'}
          size="small"
          sx={{
            m: 0,
            p: 0,
            // transform: 'scale(0.85)',
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#43a047',
            },
          }}
          // disabled // 상태 표시만 하려면 비활성화
        />
      </Box>
    ),
    options: { textAlign: 'center', cell: { width: '15%' } },
    headerOptions: { width: '15%' },
  },
];

export default function DashboardManage() {
  const [apiCall] = useApi();

  const { instance, source } = AuthInstance();

  const [isLoading, setIsLoading] = useState(true);

  const [swgOn, setSwgOn] = useState(true);
  const [vaOn, setVaOn] = useState(true);

  const [osData, setOsData] = useState([]);
  const [kernelData, setKernelData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [segmentData, setSegmentData] = useState([]);
  const [integrityData, setIntegrityData] = useState([]);
  const [processData, setProcessData] = useState([]);

  const mainCardStyle = {
    borderRadius: '10px',
    backgroundColor: '#F5F7FE',
  };

  const statusBtnStyle = (isOn) => ({
    px: 3,
    py: 1,
    borderRadius: '24px',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '0.8rem',
    minWidth: 120,
    backgroundColor: isOn ? '#43a047' : '#e53935',
    color: '#fff',
    '&:hover': {
      backgroundColor: isOn ? '#388e3c' : '#c62828',
      color: '#fff',
    },
  });

  const statusTextStyle = {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '0.8rem',
  };

  const miniTableStyle = {
    bodyCell: {
      backgroundColor: '#fff', // 또는 'white'
    },
  };

  dashboardApi.axios = instance;

  const init = async () => {
    const result = await apiCall(dashboardApi.getDashboardData);
    if (result.status === 200) {
      const { osInfo, kernelInfo, packageInfo, segmentInfo, integrityInfo, processInfo } =
        result.data;

      setOsData([{ osName: osInfo?.hostname ?? '-', version: osInfo?.version ?? '-' }]);
      setKernelData([{ version: kernelInfo?.version ?? '-' }]);

      if (Array.isArray(packageInfo) && packageInfo.length > 0) {
        const formattedPackages = packageInfo
          .filter((item) => item?.label && item?.version)
          .map((item) => ({
            packageName: item.label,
            version: item.version,
          }));
        if (formattedPackages.length > 0) {
          setPackageData(formattedPackages);
        }
      }

      if (Array.isArray(segmentInfo) && segmentInfo.length > 0) {
        const formattedSegments = segmentInfo
          .filter((item) => item?.version)
          .map((item) => ({
            vaName: item.name ?? '-',
            vaVersion: `v${item.version}`,
            swgVersion: `v${item.version}`,
          }));
        if (formattedSegments.length > 0) {
          setSegmentData(formattedSegments);
        }
      }

      if (Array.isArray(integrityInfo) && integrityInfo.length > 0) {
        const formattedIntegrity = integrityInfo
          .filter((item) => item?.label && item?.value)
          .map((item) => ({
            fileName: item.label,
            fileStatus: item.value,
          }));
        if (formattedIntegrity.length > 0) {
          setIntegrityData(formattedIntegrity);
        }
      }

      if (Array.isArray(processInfo) && processInfo.length > 0) {
        const formattedProcess = processInfo
          .filter((item) => item?.label && item?.value)
          .map((item) => ({
            proccessName: item.label,
            proccessStatus: item.value,
          }));
        if (formattedProcess.length > 0) {
          setProcessData(formattedProcess);
        }
      }
    }
    setIsLoading(false);
  };

  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    init();

    return () => {
      source.cancel();
    };
  }, []);

  return (
    <GridItem
      container
      direction="column"
      sx={{
        flexWrap: 'nowrap',
        p: 2,
        pt: 0,
        mt: 0,
        height: '85vh',
      }}
      spacing={2}
    >
      {isLoading && <Loader isGuard />}
      <GridItem item direction="row" spacing={2}>
        <GridItem item xs={5}>
          <MainCard sx={{ ...mainCardStyle, height: '130px' }}>
            <Typography variant="h5" pl={1}>
              OS 정보
            </Typography>
            <GridItem item mt={1}>
              <MiniTable
                sx={miniTableStyle}
                maxHeight="100px"
                columns={column1}
                data={osData}
                outlineBorder
              />
            </GridItem>
          </MainCard>
          <MainCard sx={{ ...mainCardStyle, mt: 1.5, height: '170px' }}>
            <Typography variant="h5" pl={1}>
              커널 정보
            </Typography>
            <GridItem item mt={1}>
              <MiniTable
                sx={miniTableStyle}
                maxHeight="100px"
                columns={column2}
                data={kernelData}
                outlineBorder
              />
            </GridItem>
          </MainCard>
          <MainCard sx={{ ...mainCardStyle, mt: 1.5, height: '450px' }}>
            <Typography variant="h5" pl={1}>
              {/* VA, SWG에 대한 openssl, ssh, php, lighttpd..  */}
              패키지 상세 정보
            </Typography>
            <GridItem item mt={1}>
              <MiniTable
                sx={miniTableStyle}
                maxHeight="380px"
                columns={column3}
                data={packageData}
                pageSize={30}
                outlineBorder
              />
            </GridItem>
          </MainCard>
        </GridItem>
        <GridItem item xs={6}>
          <MainCard sx={{ ...mainCardStyle, height: '130px' }}>
            <Typography variant="h5" pl={1}>
              서비스 상태
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={5}
              alignItems="center"
              sx={{ width: '100%' }}
            >
              <Stack spacing={1} alignItems="center">
                <Button
                  onClick={() => setVaOn((prev) => !prev)}
                  startIcon={<PowerSettingsNew />}
                  sx={{ ...statusBtnStyle(vaOn), pointerEvents: 'none' }}
                >
                  VA {vaOn ? 'ON' : 'OFF'}
                </Button>
                <Typography variant="caption" sx={statusTextStyle}>
                  상태: {vaOn ? '정상 작동 중' : '중지됨'}
                </Typography>
              </Stack>
              <Stack spacing={1} alignItems="center">
                <Button
                  onClick={() => setSwgOn((prev) => !prev)}
                  startIcon={<PowerSettingsNew />}
                  sx={{ ...statusBtnStyle(swgOn), pointerEvents: 'none' }}
                >
                  SWG {swgOn ? 'ON' : 'OFF'}
                </Button>
                <Typography variant="caption" sx={statusTextStyle}>
                  상태: {swgOn ? '정상 작동 중' : '중지됨'}
                </Typography>
              </Stack>
            </Stack>
          </MainCard>
          <MainCard sx={{ ...mainCardStyle, mt: 1.5, height: '170px' }}>
            <Typography variant="h5" pl={1}>
              세그먼트 정보
            </Typography>
            <GridItem item mt={1}>
              <MiniTable
                sx={miniTableStyle}
                maxHeight="100px"
                columns={column4}
                data={segmentData}
                pageSize={30}
                outlineBorder
              />
            </GridItem>
          </MainCard>
          <MainCard sx={{ ...mainCardStyle, mt: 1.5, height: '220px' }}>
            <Typography variant="h5" pl={1}>
              무결성 검사
            </Typography>
            <GridItem item mt={1}>
              <MiniTable
                sx={miniTableStyle}
                maxHeight="148px"
                columns={column5}
                data={integrityData}
                pageSize={30}
                outlineBorder
              />
            </GridItem>
          </MainCard>
          <MainCard sx={{ ...mainCardStyle, mt: 1.5, height: '218px' }}>
            <Typography variant="h5" pl={1}>
              프로세스 상태
            </Typography>
            <GridItem item mt={1}>
              <MiniTable
                sx={miniTableStyle}
                maxHeight="148px"
                columns={column6}
                data={processData}
                pageSize={30}
                outlineBorder
              />
            </GridItem>
          </MainCard>
        </GridItem>
        <GridItem item xs={1}></GridItem>
      </GridItem>
    </GridItem>
  );
}

DashboardManage.getLayout = function getLayout(page) {
  return <Layout authRequired={true}>{page}</Layout>;
};
