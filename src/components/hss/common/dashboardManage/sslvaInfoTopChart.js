import { useEffect, useCallback, useRef, useState } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';
import { unstable_batchedUpdates } from 'react-dom';

import { AuthInstance } from '@modules/axios';
import statApi from '@api/hss/common/statManage/statApi';
import useApi from '@modules/hooks/useApi';
import BarChartData5_tmp from './barChartData5_tmp';

function SslvaInfoTopChart({ isRefreshing = false }) {
  const { instance, source } = AuthInstance();

  statApi.axios = instance;
  const [apiCall] = useApi();

  const [chartData, setChartData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const getTopData = useCallback(async () => {
    setHasReceivedData(false);

    const darkThemeColors = [
      '#1F77B4',
      '#FF7F0E',
      '#2CA02C',
      '#D62728',
      '#9467BD',
      '#8C564B',
      '#E377C2',
      '#7F7F7F',
      '#BCBD22',
      '#17BECF',
      '#393B79',
      '#637939',
      '#8C6D31',
      '#843C39',
      '#B5CF6B',
    ];

    const now = new Date();
    const minute_Range = 60 * 6;
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
      dimension: '*_conn,*_disconn',
      after: afterTimestamp,
      before: beforeTimestamp,
      name: '*.URL',
      type: 'min',
    });

    // console.log('getTopData');
    // console.table(receiveData);

    if (Object.keys(receiveData).length > 0 && receiveData.labels?.length > 0) {
      const filteredLabels = receiveData.labels.slice(1);
      const colorCount = darkThemeColors.length;
      const seriesData_new = filteredLabels.map((label, index) => ({
        label: label,
        y: label,
        fill: darkThemeColors[index % colorCount],
        stroke: darkThemeColors[index % colorCount],
        fillOpacity: 0.5,
      }));

      const chartData_new = receiveData.data.map((row) => {
        let entry = { date: new Date(row[0] * 1000) };
        filteredLabels.forEach((label, index) => {
          entry[label] = row[index + 1];
        });
        return entry;
      });

      chartData_new.sort((a, b) => a.date - b.date);

      unstable_batchedUpdates(() => {
        setChartData(chartData_new);
        setSeriesData(seriesData_new);
      });
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
      getTopData();
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    getTopData();

    return () => {
      source.cancel();
    };
  }, []);

  return hasReceivedData ? (
    <BarChartData5_tmp
      id="SslvaInfoTopChart"
      chartData={{
        data: chartData,
        x: 'date',
        seriesData: seriesData,
      }}
    />
  ) : (
    <LoadingButton loadingPosition="center" color="secondary" loading />
  );
}

export default SslvaInfoTopChart;
