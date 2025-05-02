import { useEffect, useCallback, useRef, useState } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';
import MiniTable from '@components/modules/table/MiniTable';

import { AuthInstance } from '@modules/axios';
import statApi from '@api/hss/common/statManage/statApi';
import useApi from '@modules/hooks/useApi';
import { useIntl } from 'react-intl';

function SslvaDenyTopTable({ isRefreshing = false }) {
  const intl = useIntl();

  const { instance, source } = AuthInstance();

  statApi.axios = instance;
  const [apiCall] = useApi();

  const [denyTableData, setDenyTableData] = useState([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const denyColumns = [
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-rank' }),
      id: 'no',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '40px', maxWidth: '40px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-client-ip' }),
      id: 'cli_ip',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '120px', maxWidth: '120px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-connection-count' }),
      id: 'conn_count',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-disconnect-count' }),
      id: 'disconn_count',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslva-ssl-fail-count' }),
      id: 'handshake_fail_count',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
  ];

  const getDenyData = useCallback(async () => {
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

    // console.log('## getDenyData ##');
    // console.table(receiveData);

    if (Object.keys(receiveData).length > 0 && receiveData.top?.length > 0) {
      const columnData = receiveData.top.map((ip, idx) => {
        const datas = receiveData?.[ip]?.data?.slice(0, 3) ?? [];

        return {
          no: idx + 1,
          cli_ip: ip,
          conn_count: Math.floor(datas?.[0] ?? 0).toString(),
          disconn_count: Math.floor(datas?.[1] ?? 0).toString(),
          handshake_fail_count: Math.floor(datas?.[2] ?? 0).toString(),
        };
      });

      //console.table(columnData);

      const paddedData = Array.from({ length: 5 }).map((_, i) => {
        return (
          columnData[i] ?? {
            no: i + 1,
            cli_ip: '-',
            conn_count: '-',
            disconn_count: '-',
            handshake_fail_count: '-',
          }
        );
      });

      // console.log(paddedData);
      setDenyTableData(paddedData);
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
      getDenyData();
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    getDenyData();

    return () => {
      source.cancel();
    };
  }, []);

  return hasReceivedData ? (
    <MiniTable
      columns={denyColumns}
      data={denyTableData}
      onlyDark
      // ellipsis
      outlineBorder
    />
  ) : (
    <LoadingButton loadingPosition="center" color="secondary" loading />
  );
}

export default SslvaDenyTopTable;
