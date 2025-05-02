import messageFilterHistoryApi from '@api/status/cds/messageFilter/messageFilterHistoryApi';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import MessageFilterHistoryActionButton from '@components/status/cds/messageFilter/messageFilterHistoryActionButton';
import MessageFilterHistorySearchForm from '@components/status/cds/messageFilter/messageFilterHistorySearchForm';
import MessageFilterHistoryTable from '@components/status/cds/messageFilter/messageFilterHistoryTable';
import { AuthInstance } from '@modules/axios';
import HsFileHandler from '@modules/common/HsFileHandler';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/messageFilterHis';
import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

function MessageFilterHistory() {
  const { instance, source } = AuthInstance();
  messageFilterHistoryApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.messageFilterHis);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('MessageFilterHis', messageFilterHistoryApi);

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

  const getMessageFilterHisList = async (param) => {
    const { totalElements, content } = await apiCall(
      messageFilterHistoryApi.getMessageFilterHistoryList,
      param,
    );
    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleExcelButtonClick = async () => {
    const result = await apiCall(
      messageFilterHistoryApi.getMessageFilterHistoryListExcel,
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

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getMessageFilterHisList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <MessageFilterHistorySearchForm />
      <MessageFilterHistoryActionButton
        onSearchButtonClick={getMessageFilterHisList}
        onExcelButtonClick={handleExcelButtonClick}
      />
      <MessageFilterHistoryTable />
    </GridItem>
  );
}

MessageFilterHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default MessageFilterHistory;
