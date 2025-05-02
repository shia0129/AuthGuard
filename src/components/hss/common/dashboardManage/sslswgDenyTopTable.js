import { useEffect, useCallback, useRef, useState } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';
import MiniTable from '@components/modules/table/MiniTable';

import { AuthInstance } from '@modules/axios';
import statApi from '@api/hss/common/statManage/statApi';
import useApi from '@modules/hooks/useApi';
import { useIntl } from 'react-intl';

function SslswgDenyTopTable({ isRefreshing = false }) {
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
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-rank' }),
      id: 'no',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '40px', maxWidth: '40px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-ip' }),
      id: 'ip',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '80px', maxWidth: '80px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-allow' }),
      id: 'accept',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-block' }),
      id: 'deny',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-block-url' }),
      id: 'urlBlock',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-block-site' }),
      id: 'siteBlock',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-block-pattern-url' }),
      id: 'patternBlockUrl',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-block-pattern-header' }),
      id: 'patternBlockHeader',
      options: { textAlign: 'center' },
      headerOptions: { minWidth: '100px', maxWidth: '100px' },
    },
    {
      label: intl.formatMessage({ id: 'monitoring.monitoring-sslswg-block-pattern-payload' }),
      id: 'patternBlockPayload',
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
      //dimension:
      //  '*_accept,*_deny, *_banned_site,*_banned_url,*_banned_phrase,*_banned_pattern_url,*_banned_pattern_header',
      after: afterTimestamp,
      before: beforeTimestamp,
      count: 5,
      name: 'SWG.*',
    });

    if (Object.keys(receiveData).length > 0 && receiveData.top?.length > 0) {
      const columnData = receiveData.top.map((ip, idx) => {
        const datas = receiveData?.[ip]?.data?.slice(0, 7) ?? [];

        return {
          no: idx + 1,
          ip,
          accept: Math.floor(datas?.[0] ?? 0).toString(),
          deny: Math.floor(datas?.[1] ?? 0).toString(),
          urlBlock: Math.floor(datas?.[2] ?? 0).toString(),
          siteBlock: Math.floor(datas?.[3] ?? 0).toString(),
          patternBlockUrl: Math.floor(datas?.[4] ?? 0).toString(),
          patternBlockHeader: Math.floor(datas?.[5] ?? 0).toString(),
          patternBlockPayload: Math.floor(datas?.[6] ?? 0).toString(),
        };
      });

      const paddedData = Array.from({ length: 5 }).map((_, i) => {
        return (
          columnData[i] ?? {
            no: i + 1,
            ip: '-',
            accept: '-',
            deny: '-',
            urlBlock: '-',
            siteBlock: '-',
            patternBlockUrl: '-',
            patternBlockHeader: '-',
            patternBlockPayload: '-',
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

export default SslswgDenyTopTable;
