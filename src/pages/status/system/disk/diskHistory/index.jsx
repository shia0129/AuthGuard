import diskHistoryApi from '@api/status/system/disk/diskHistoryApi';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import DiskHistoryActionButton from '@components/status/system/disk/diskHistoryActionButton';
import DiskHistorySearchForm from '@components/status/system/disk/diskHistorySearchForm';
import DiskHistoryTable from '@components/status/system/disk/diskHistoryTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/diskHis';
import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

function DiskHistory() {
  const { instance, source } = AuthInstance();

  diskHistoryApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.diskHis);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DiskStatHistory', diskHistoryApi);

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

  const getDiskStateHistoryList = async (param) => {
    const { totalElements, content } = await apiCall(diskHistoryApi.getDiskStatHistoryList, param);

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
    getDiskStateHistoryList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <DiskHistorySearchForm />
      <DiskHistoryActionButton onSearchButtonClick={getDiskStateHistoryList} />
      <DiskHistoryTable />
    </GridItem>
  );
}

DiskHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DiskHistory;
