import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchSSEApi } from '@api/common/fetchSSEApi';
import BarChartData from './barChartData';
import LoadingButton from '@components/modules/button/LoadingButton';

function NetworkTrafficChart() {
  const eventSource = useRef(null);
  const { data: session } = useSession();
  
  const [chartData, setChartData] = useState([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);
  
  const onOpen = () => {};
  const onMessage = (event) => {
    try {
      const { attribute } = JSON.parse(event);
      const { server_info: serverInfo } = attribute;
      const { data, labels } = serverInfo[0];

      const timeIdx = labels.indexOf('time');
      const receivedIdx = labels.indexOf('received');
      const sentIdx = labels.indexOf('sent');

      const receivedData = data.map((d) => ({
        date: new Date(d[timeIdx] * 1000),
        received: d[receivedIdx],
        sent: Math.abs(d[sentIdx]),
      }));

      receivedData.sort((a, b) => a.date - b.date);
      setChartData(receivedData);

      if (!hasReceivedData) {
        setHasReceivedData(true);
      }
    } catch (error) {
      console.error("### NetworkTrafficChart.js ### ERROR in onMessage:", error);
    }
  };

  const onError = (error) => {
    console.error("### NetworkTrafficChart.js ### ERROR in onError:", error);
  };
  
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    const oneWeekAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60 * 7;
    const oneWeekHourCount = 168;

    try {
      eventSource.current = fetchSSEApi.connectToEventSource(
        `/api/event/netdata?chart=system.net&after=${oneWeekAgo}&format=json&points=${oneWeekHourCount}`,
        session?.user.hsssessionid,
        session?.accessToken,
        onOpen,
        onMessage,
        onError,
      );
    } catch (error) {
      console.error("### NetworkTrafficChart.js ### ERROR connecting to SSE:", error);
    }

    return () => {
      if (eventSource.current) {
        fetchSSEApi.closeEventSource(eventSource.current);
        eventSource.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (hasReceivedData && eventSource.current) {
      fetchSSEApi.closeEventSource(eventSource.current);
      eventSource.current = null;
    }
  }, [hasReceivedData]);

  return hasReceivedData ? (
    <BarChartData
      id="networkTrafficChart"
      chartData={{
        data: chartData,
        x: 'date',
        seriesData: [
          {
            label: 'Received(kbps)',
            y: 'received',
            fill: '#1ED6FF',
            stroke: '#1ED6FF',
            fillOpacity: 0.5,
          },
          {
            label: 'Sent(kbps)',
            y: 'sent',
            fill: '#5A3FFF',
            stroke: '#5A3FFF',
            fillOpacity: 0.3,
          },
        ],
      }}
    />
  ) : (
    <LoadingButton loadingPosition="center" color="secondary" loading />
  );
}

export default NetworkTrafficChart;
