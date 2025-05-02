import { useEffect, useCallback, useRef, useState } from 'react';

import { AuthInstance } from '@modules/axios';
import statApi from '@api/hss/common/statManage/statApi';
import useApi from '@modules/hooks/useApi';
import LoadingButton from '@components/modules/button/LoadingButton';
import BarChartData5_tmp from './barChartData5_tmp';

function SslswgStatusChart({ isRefreshing = false }) {
  const { instance, source } = AuthInstance();

  statApi.axios = instance;
  const [apiCall] = useApi();

  const [chartData, setChartData] = useState([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const getAcceptDenyData = useCallback(async () => {
    setHasReceivedData(false);

    const now = new Date();
    const minute_Range = 120;
    const beforeTimestamp = Math.floor(now.getTime() / 1000);
    const mergeTimestamp = Math.floor((now.getTime() - 60 * 1000 * minute_Range) / 1000);
    const afterTimestamp = mergeTimestamp - beforeTimestamp;
    // console.log(
    //   '## midnight: ',
    //   mergeTimestamp,
    //   ' ## before: ',
    //   beforeTimestamp,
    //   ' ## after: ',
    //   afterTimestamp,
    //   ' ##',
    // );

    const receiveData = await apiCall(statApi.getStatSumData, {
      chart: 'context',
      dimension: '*_accept,*_deny',
      after: afterTimestamp,
      before: beforeTimestamp,
      name: 'SWG.*',
      type: 'min',
    });

    // console.log('## getAcceptDenyData ##');
    // console.table(receiveData);

    if (Object.keys(receiveData).length > 0 && receiveData.data?.length > 0) {
      const chartData_new = receiveData.data.map((d) => ({
        date: new Date(d[0] * 1000),
        accept: d[1],
        deny: d[2],
      }));

      chartData_new.sort((a, b) => a.date - b.date);
      setChartData(chartData_new);
    }

    setHasReceivedData(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isRefreshing) {
      getAcceptDenyData();
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    getAcceptDenyData();

    return () => {
      source.cancel();
    };
  }, []);

  return hasReceivedData ? (
    <BarChartData5_tmp
      id="SslswgStatusChart"
      chartData={{
        data: chartData,
        x: 'date',
        seriesData: [
          {
            label: 'Accept(Count)',
            y: 'accept',
            fill: '#1ED6FF',
            stroke: '#1ED6FF',
            fillOpacity: 0.5,
          },
          {
            label: 'Deny(Count)',
            y: 'deny',
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

export default SslswgStatusChart;
