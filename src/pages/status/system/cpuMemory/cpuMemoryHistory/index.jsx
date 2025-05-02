import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import CpuMemorySearchForm from '@components/status/system/cpuMemory/cpuMemorySearchForm';
import CpuMemoryActionButton from '@components/status/system/cpuMemory/cpuMemoryActionButton';
import CpuMemoryTable from '@components/status/system/cpuMemory/cpuMemoryTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';

import cpuMemoryHistoryApi from '@api/status/system/cpuMemory/cpuMemoryHistoryApi';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/cpuMemoryHis';

function CpuMemHistory() {
  const { instance, source } = AuthInstance();

  cpuMemoryHistoryApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.cpuMemoryHis);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('CpuMemHistory', cpuMemoryHistoryApi);

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

  const getCpuMemHistoryList = async (param) => {
    const { totalElements, content } = await apiCall(
      cpuMemoryHistoryApi.getCpuMemHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
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
    getCpuMemHistoryList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <CpuMemorySearchForm />
      <CpuMemoryActionButton onSearchButtonClick={getCpuMemHistoryList} />
      <CpuMemoryTable />
    </GridItem>
  );
}

CpuMemHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CpuMemHistory;
