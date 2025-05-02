import { useEffect, useCallback, useRef, useState } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';
import MiniTable from '@components/modules/table/MiniTable';

import { AuthInstance } from '@modules/axios';
import statApi from '@api/hss/common/statManage/statApi';
import useApi from '@modules/hooks/useApi';
import { useIntl } from 'react-intl';

function SslvaAccessTopTable({ isRefreshing = false }) {
  const intl = useIntl();

  const { instance, source } = AuthInstance();

  statApi.axios = instance;
  const [apiCall] = useApi();

  const [accessTableData, setAccessTableData] = useState([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const accessColumns = [
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-rank' }),
      id: 'no',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '40px', maxWidth: '40px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-client-ip' }),
      id: 'ip',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '120px', maxWidth: '120px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-url1' }),
      id: 'url1',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '150px', maxWidth: '150px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-url2' }),
      id: 'url2',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '150px', maxWidth: '150px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-url3' }),
      id: 'url3',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '150px', maxWidth: '150px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-url4' }),
      id: 'url4',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '150px', maxWidth: '150px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-url5' }),
      id: 'url5',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '150px', maxWidth: '150px' },
    },
  ];

  const getAccessData = useCallback(async () => {
    setHasReceivedData(false);
    const now = new Date();
    const beforeTimestamp = Math.floor(now.getTime() / 1000);

    now.setHours(0, 0, 0, 0);
    const midnight = Math.floor(now.getTime() / 1000);
    const afterTimestamp = midnight - beforeTimestamp;

    //const before = new Date(midnight * 1000);
    //const now_time = new Date(beforeTimestamp * 1000);
    //console.log("## midnight: ", before.toLocaleString(), " ## now: ", now_time.toLocaleString(), " ##");
    //console.log("## midnight: ", midnight, " ## before: ", beforeTimestamp, " ## after: ", afterTimestamp, " ##");

    const receiveData = await apiCall(statApi.getStatTopList, {
      chart: 'context',
      dimension: '*_conn,*_disconn,*_handshake_fail',
      after: afterTimestamp,
      before: beforeTimestamp,
      count: 5,
      url_count: 5,
      name: '*.URL',
    });
    // console.log(receiveData);

    if (Object.keys(receiveData).length > 0 && receiveData.top?.length > 0) {
      const columnData = receiveData.top.map((ip, idx) => {
        const urls = receiveData[ip]?.url_label?.slice(0, 5) ?? [];

        return {
          no: idx + 1,
          ip,
          url1: urls?.[0] ?? '-',
          url2: urls?.[1] ?? '-',
          url3: urls?.[2] ?? '-',
          url4: urls?.[3] ?? '-',
          url5: urls?.[4] ?? '-',
        };
      });

      const paddedData = Array.from({ length: 5 }).map((_, i) => {
        return (
          columnData[i] ?? {
            no: i + 1,
            ip: '-',
            url1: '-',
            url2: '-',
            url3: '-',
            url4: '-',
            url5: '-',
          }
        );
      });

      setAccessTableData(paddedData);
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
      getAccessData();
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    getAccessData();

    return () => {
      source.cancel();
    };
  }, []);

  return hasReceivedData ? (
    <MiniTable
      columns={accessColumns}
      data={accessTableData}
      onlyDark
      // ellipsis
      outlineBorder
    />
  ) : (
    <LoadingButton loadingPosition="center" color="secondary" loading />
  );
}

export default SslvaAccessTopTable;
