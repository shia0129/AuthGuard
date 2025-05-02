// libraries
import { useEffect ,useRef} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import MonitoringLogSearchForm from '@components/manage/admin-monitoring/monitoringLog/monitoringLogSearchForm';
import MonitoringLogActionButton from '@components/manage/admin-monitoring/monitoringLog/monitoringLogActionButton';
import MonitoringLogTable from '@components/manage/admin-monitoring/monitoringLog/monitoringLogTable';

// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/monitoringLog';
import HsFileHandler from '@modules/common/HsFileHandler';
import monitoringLogApi from '@api/manage/admin-monitoring/monitoringLogApi';

function MonitoringLog() {
  const { instance, source } = AuthInstance();

  monitoringLogApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.monitoringLog);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('MonitoringLog', monitoringLogApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns(p_gridInfo.columns));
    dispatch(setListInfo(p_gridInfo.listInfo));
    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getMonitoringLogList = async (param) => {
    const { totalElements, content } = await apiCall(monitoringLogApi.getMonitoringLogList, param);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const getMonitoringLogListExcel = async () => {
    const result = await apiCall(
      monitoringLogApi.getMonitoringLogExcelList,
      parameterData.parameters.current,
    );

    const { isSuccess, message } = HsFileHandler.saveAsExcel(result);

    if (!isSuccess) {
      openModal({
        message,
        type: 'error',
      });
    }
  };
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();
    return () => source.cancel();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getMonitoringLogList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <MonitoringLogSearchForm />
      <MonitoringLogActionButton
        onSearchButtonClick={getMonitoringLogList}
        onExcelButtonClick={getMonitoringLogListExcel}
      />
      <MonitoringLogTable />
    </GridItem>
  );
}

MonitoringLog.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default MonitoringLog;
