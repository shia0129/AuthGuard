import { useEffect, useCallback, useRef, useState } from 'react';
import LoadingButton from '@components/modules/button/LoadingButton';
import MiniTable from '@components/modules/table/MiniTable';

import { AuthInstance } from '@modules/axios';
import statApi from '@api/hss/common/statManage/statApi';
import useApi from '@modules/hooks/useApi';


function DenyTopTable() {
  const { instance, source } = AuthInstance();

  statApi.axios = instance;
  const [apiCall] = useApi();

  const [DenyTableData, setDenyTableData] = useState([]);
  const [hasReceivedData, setHasReceivedData] = useState(false);

  const columnStyle = {
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  };

  const column1 = [
    {
      label: '클라이언트 IP',
      id: 'cli_ip',
      options: columnStyle,
    },
    {
      label: '접속 횟수',
      id: 'conn_count',
      options: columnStyle,
    },
    {
      label: '접속종료 횟수',
      id: 'disconn_count',
      options: columnStyle,
    },
    {
      label: 'SSL 핸드쉐이크 실패 횟수',
      id: 'handshake_fail_count',
      options: columnStyle,
    },
  ];

  const getDenyData = useCallback(async () => {
    const now = new Date();
    const beforeTimestamp = Math.floor(now.getTime() / 1000);

    now.setHours(0, 0, 0, 0);
    const midnight = Math.floor(now.getTime() / 1000);
    const afterTimestamp = midnight - beforeTimestamp

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

    //console.log("## getDenyData ##");
    //console.table(receiveData);

    if (Object.keys(receiveData).length > 0) {
      const columnData = receiveData.top.map((ip) => {
          const ipData = receiveData[ip];
          
          return {
            cli_ip: ip,
            conn_count: Math.floor(ipData.data[0]),
            disconn_count: Math.floor(ipData.data[1]),
            handshake_fail_count: Math.floor(ipData.data[2]),
          };
      });

      //console.table(columnData);

      if (!hasReceivedData) {
        setHasReceivedData(true);
      }

      setDenyTableData(columnData);
    }
  }, []);

  const useEffect_0001 = useRef(false);
  useEffect(() => {
   if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    };

    getDenyData();

    return () => {
      source.cancel();
    };
  }, []);

  return hasReceivedData ? (
    <MiniTable
      ellipsis
      columns={column1}
      data={DenyTableData}
      sx={{
        container: { border: 'unset !important' },
        head: {
          '& th': {
            color: '#eee',
            backgroundColor: '#272C38',
            minWidth: '70px',
            border: 'unset',
          },
        },
        body: {
          '& p': { color: '#dddddd', backgroundColor: 'unset', lineHeight: '20px;' },
          '& tr:last-of-type > td': { borderBottom: '1px solid !important' },
        },
        bodyRow: {
          ':hover': { backgroundColor: '#f5f5f521 !important' },
          '& div': { height: '20px' },
          ':last-of-type > td': { borderBottom: '1px solid #f5f5f547 !important' },
        },
        bodyCell: {
          height: '20px',
          maxHeight: '20px',
          borderRight: 'unset !important',
          borderColor: '#f5f5f547 !important',
        },
      }}
    />
    
  ) : (
      <LoadingButton loadingPosition="center" color="secondary" loading />
  );
}

export default DenyTopTable;
