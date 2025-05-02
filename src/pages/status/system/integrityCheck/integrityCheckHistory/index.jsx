import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import IntegrityCheckSearchForm from '@components/status/system/integrityCheck/integrityCheckSearchForm';
import IntegrityCheckActionButton from '@components/status/system/integrityCheck/integrityCheckActionButton';
import IntegrityCheckTable from '@components/status/system/integrityCheck/integrityCheckTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import {
  setParameters,
  setColumns,
  setListInfo,
  setPageDataList,
} from '@modules/redux/reducers/integrityCheck';
import integrityCheckHistoryApi from '@api/status/system/integrityCheck/integrityCheckHistoryApi';
import HsFileHandler from '@modules/common/HsFileHandler';

function IntegrityCheckHistory() {
  const { instance, source } = AuthInstance();

  integrityCheckHistoryApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.integrityCheck);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('IntegrityChkHis', integrityCheckHistoryApi);

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

  const getIntegrityCheckList = async (param) => {
    const { totalElements, content } = await apiCall(
      integrityCheckHistoryApi.getIntegrityCheckHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleExcelButtonClick = async () => {
    const result = await apiCall(
      integrityCheckHistoryApi.getIntegrityCheckExcelList,
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
    getIntegrityCheckList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <IntegrityCheckSearchForm />
      <IntegrityCheckActionButton
        onSearchButtonClick={getIntegrityCheckList}
        onExcelButtonClick={handleExcelButtonClick}
      />
      <IntegrityCheckTable />
    </GridItem>
  );
}

IntegrityCheckHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default IntegrityCheckHistory;
