import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchSSEApi } from '@api/common/fetchSSEApi';
import dynamic from 'next/dynamic';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Typography } from '@mui/material';
import LoadingButton from '@components/modules/button/LoadingButton';

const LineRealRangeChart = dynamic(
  () => import('@components/third-party/am-chart/5/LineRealRangeChart'),
  { ssr: false },
);

const LineRealChart = dynamic(() => import('@components/third-party/am-chart/5/LineRealChart'), {
  ssr: false,
});

const initChartData = () => ({ date: new Date().getTime(), usage: 0 });

function SystemRealtimeCharts() {
  const { data: session } = useSession();

  const cpuRef = useRef(null);
  const memRef = useRef(null);
  const netRef = useRef(null);

  const [cpuData, setCpuData] = useState([initChartData()]);
  const [memData, setMemData] = useState([initChartData()]);
  const [netData, setNetData] = useState([
    {
      date: new Date().getTime(),
      rx: 0,
      tx: 0,
    },
  ]);

  const [cpuList, setCpuList] = useState(false);
  const [memList, setMemList] = useState(false);
  const [netList, setNetList] = useState(false);

  const handleChart = (ref) => (chart, series) => {
    ref.current = series;
  };

  useEffect(() => {
    if (!session) return;

    const onMessage = (event) => {
      const { attribute } = JSON.parse(event);
      const serverInfo = attribute.server_info || [];
      const now = new Date().getTime();

      const cpu = serverInfo.find((d) => d.name === 'system.cpu');
      if (cpu?.dimensions?.user && cpu?.dimensions?.system) {
        const usage = cpu.dimensions.user.value + cpu.dimensions.system.value;
        const point = { date: now, usage };

        if (cpuRef.current) {
          if (cpuRef.current.data.length > 30) cpuRef.current.data.removeIndex(0);
          cpuRef.current.data.push(point);
        }
        setCpuData((prev) => [...prev.slice(-29), point]);

        if (!cpuList) setCpuList(true);
      }

      const mem = serverInfo.find((d) => d.name === 'system.ram');
      if (mem?.dimensions?.used && mem?.dimensions?.free && mem?.dimensions?.cached) {
        const total =
          mem.dimensions.used.value + mem.dimensions.free.value + mem.dimensions.cached.value;
        const usage = Number(((mem.dimensions.used.value / total) * 100).toFixed(2));
        const point = { date: now, usage };

        if (memRef.current) {
          if (memRef.current.data.length > 30) memRef.current.data.removeIndex(0);
          memRef.current.data.push(point);
        }
        setMemData((prev) => [...prev.slice(-29), point]);

        if (!memList) setMemList(true);
      }

      const net = serverInfo.find((d) => d.name === 'system.net');
      if (net?.dimensions?.InOctets && net?.dimensions?.OutOctets) {
        const rx = Math.max(net.dimensions.InOctets.value, 0) / 8;
        const tx = Math.max(net.dimensions.OutOctets.value, 0) / 8;
        const point = { date: now, rx, tx };

        if (netRef.current) {
          netRef.current.forEach((series) => {
            const key = series.get('valueYField');
            if (!key) return;
            if (series.data.length > 30) series.data.removeIndex(0);
            series.data.push({ date: now, [key]: point[key] });
          });
        }
        setNetData((prev) => [...prev.slice(-29), point]);

        if (!netList) setNetList(true);
      }
    };

    const eventSource = fetchSSEApi.connectToEventSource(
      '/api/event/netdata/realtime?names=system.cpu,system.ram,system.net',
      session?.user?.hsssessionid,
      session?.accessToken,
      () => {},
      onMessage,
      (err) => console.error('SSE Error:', err),
    );

    return () => fetchSSEApi.closeEventSource(eventSource);
  }, [session]);

  return (
    <GridItem item direction="row" spacing={1}>
      <GridItem item xs={4}>
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
          <GridItem
            item
            divideColumn={3}
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="title1">CPU</Typography>
          </GridItem>
          <GridItem item mt={2}>
            {cpuList ? (
              <LineRealRangeChart
                id="cpuChart"
                theme="dark"
                customHandler={handleChart(cpuRef)}
                chartData={{
                  data: cpuData,
                  x: 'date',
                  seriesData: [
                    {
                      label: 'CPU 사용률',
                      y: 'usage',
                      stroke: '#ef5350',
                      fill: '#ef9a9a',
                      fillOpacity: 0.3,
                    },
                  ],
                  legendData: { x: 180 },
                }}
              />
            ) : (
              <LoadingButton loadingPosition="center" color="secondary" loading />
            )}
          </GridItem>
        </MainCard>
      </GridItem>
      <GridItem item xs={4}>
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
          <GridItem
            item
            divideColumn={3}
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="title1">MEM</Typography>
          </GridItem>
          <GridItem item mt={2}>
            {memList ? (
              <LineRealRangeChart
                id="memChart"
                theme="dark"
                customHandler={handleChart(memRef)}
                chartData={{
                  data: memData,
                  x: 'date',
                  seriesData: [
                    {
                      label: 'Memory 사용률',
                      y: 'usage',
                      stroke: '#1976d2',
                      fill: '#64b5f6',
                      fillOpacity: 0.3,
                    },
                  ],
                  legendData: { x: 180 },
                }}
              />
            ) : (
              <LoadingButton loadingPosition="center" color="secondary" loading />
            )}
          </GridItem>
        </MainCard>
      </GridItem>
      <GridItem item xs={4}>
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
          <GridItem
            item
            divideColumn={3}
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography variant="title1">Network Traffic (KBps)</Typography>
          </GridItem>
          <GridItem item mt={2}>
            {netList ? (
              <LineRealChart
                id="netChart"
                theme="dark"
                customHandler={(chart) => {
                  netRef.current = chart.series.values;
                }}
                chartData={{
                  data: netData,
                  x: 'date',
                  seriesData: [
                    {
                      label: '수신 (RX)',
                      y: 'rx',
                      stroke: '#42a5f5',
                      fill: '#42a5f5',
                      fillOpacity: 0.3,
                    },
                    {
                      label: '송신 (TX)',
                      y: 'tx',
                      stroke: '#ef5350',
                      fill: '#ef5350',
                      fillOpacity: 0.3,
                    },
                  ],
                  legendData: { x: 180 },
                }}
              />
            ) : (
              <LoadingButton loadingPosition="center" color="secondary" loading />
            )}
          </GridItem>
        </MainCard>
      </GridItem>
    </GridItem>
  );
}

export default React.memo(SystemRealtimeCharts);
