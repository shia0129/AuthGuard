// Packetcapture.jsx (전체 리팩토링)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PacketcaptureForm from '@components/hss/sslva/policy/packetcapture/PacketcaptureForm';
import PacketcaptureActionButton from '@components/hss/sslva/policy/packetcapture/PacketcaptureActionButton';
import PacketcaptureListTable from '@components/hss/sslva/policy/packetcapture/PacketcaptureListTable';
import PacketcaptureDetail from '@components/hss/sslva/policy/packetcapture/PacketcaptureDetail';
import PacketcaptureHexViewer from '@components/hss/sslva/policy/packetcapture/PacketcaptureHexViewer';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import packetcaptureStatusApi from '@api/hss/sslva/policy/packetcaptureStatusApi';
import interfaceApi from '@api/hss/common/networkManage/interfaceApi';
import segmentStatusApi from '@api/hss/sslva/policy/segmentStatusApi';
import {
  setLinkedNameList,
  setSegmentNameList,
  resetState,
} from '@modules/redux/reducers/hss/sslva/packetcaptureStatus';
import { CircularProgress } from '@mui/material';

function PacketcapturePage() {
  const dispatch = useDispatch();
  const { instance, source } = AuthInstance();
  const [apiCall, openModal] = useApi();

  const [isLoading, setIsLoading] = useState(false);

  const [packets, setPackets] = useState([]);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  // API 인스턴스 주입
  //useEffect(() => {
  packetcaptureStatusApi.axios = instance;
  interfaceApi.axios = instance;
  segmentStatusApi.axios = instance;
  //}, [instance]);

  // 인터페이스 리스트 로딩
  const getInterfaceList = async () => {
    try {
      const data = await apiCall(interfaceApi.getInterfaceList, { contentOnly: true });

      if (Array.isArray(data)) {
        const linkedlist = data
          .filter((item) => item.type !== 'bridge' && item.member === 'Linked')
          .map((item) => ({ value: item.name, label: item.name }));

        dispatch(setLinkedNameList(linkedlist));
      } else {
        dispatch(setLinkedNameList([]));
      }
    } catch (error) {
      dispatch(setLinkedNameList([]));
    }
  };

  // 세그먼트 리스트 로딩
  const getSegmentNameList = async () => {
    try {
      const data = await apiCall(segmentStatusApi.getSegmentStatusColumnList, 'name');

      if (Array.isArray(data)) {
        const list = data.map((item) => ({ value: item, label: item }));
        dispatch(setSegmentNameList(list));
      } else {
        dispatch(setSegmentNameList([]));
      }
    } catch (error) {
      dispatch(setSegmentNameList([]));
    }
  };

  // 패킷 로딩
  const getPacketcaptureList = useCallback(async (param = {}, showModal = false) => {
    if (
      !param?.container ||
      param.container === '' ||
      !param?.interface ||
      param.interface === ''
    ) {
      if (showModal) {
        openModal({
          message: 'Linked Interface와 세그먼트명을 선택하세요.',
        });
      }

      setIsLoading(false);
      return;
    }

    setIsLoading(true); // 1. 로딩 시작
    // setSelectedPacket(null);      // 2. 선택된 패킷 초기화
    // setPackets([]);                // 3. 리스트 초기화
    const { packets = [] } = await apiCall(packetcaptureStatusApi.getpacketcaptureList, param);

    setPackets(packets);
    setSelectedPacket(null);
    setIsLoading(false); // 5. 로딩 끝
  }, []);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    dispatch(resetState());
    getInterfaceList();
    getSegmentNameList();
    return () => source.cancel();
  }, []);
  // }, [getInterfaceList, getSegmentNameList, source]);
  return (
    <Box sx={{ p: 2 }}>
      <PacketcaptureForm />
      <Box sx={{ my: 2 }}>
        <PacketcaptureActionButton
          onStartButtonClick={(params) => getPacketcaptureList(params, true)}
        />
      </Box>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px', // 또는 전체 화면 중앙을 원한다면 '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={2}>
              <PacketcaptureListTable
                packets={packets}
                onSelectPacket={(pkt, index) => {
                  setSelectedPacket(pkt);
                  setSelectedIndex(index);
                }}
                selectedPacketId={selectedIndex}
              />
            </Paper>
          </Grid>

          {selectedPacket && (
            <>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6">Packet Details</Typography>
                  <PacketcaptureDetail details={selectedPacket} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6">Hex & ASCII View</Typography>
                  {/* <PacketcaptureHexViewer hexData={selectedPacket._source?.layers?.frame_raw} /> */}
                  {/* <PacketcaptureHexViewer hexData={selectedPacket._source} /> */}
                  {/* <PacketcaptureHexViewer hexData="48656c6c6f20576f726c64210a" /> */}
                  <PacketcaptureHexViewer hexData={selectedPacket?._source?.layers?.frame_raw} />
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default PacketcapturePage;
