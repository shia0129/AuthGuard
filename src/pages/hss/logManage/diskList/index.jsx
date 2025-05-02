import { useEffect, useCallback,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import DiskSearchForm from '@components/modal/hss/common/logManage/disk/diskSearchForm';
import DiskActionButton from '@components/modal/hss/common/logManage/disk/diskActionButton';
import DiskTable from '@components/modal/hss/common/logManage/disk/diskTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
  setZoneNameList,
} from '@modules/redux/reducers/hss/common/disk';

import useApi from '@modules/hooks/useApi';
import diskApi from '@api/hss/common/logManage/diskApi';
import zoneApi from '@api/hss/sslvpn/zoneApi';

function DiskList() {
  const { instance, source } = AuthInstance();

  diskApi.axios = instance;
  zoneApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.disk);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DiskList', diskApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
    
    getZoneNameList();
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

  const getDiskList = async (param) => {
  //   const { totalElements, content } = await apiCall(
  //     diskApi.getDiskList,
  //     param,
  //   );

  //   dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const getZoneNameList = useCallback(async () => {
    const data = await apiCall(zoneApi.getZoneColumnList, 'name');
    if (data) {
      const list = data.map((item) => ({
        value: item,
        label: item,
      }));
      dispatch(setZoneNameList(list));
    }
  }, []);
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
    // getDiskList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <DiskSearchForm />
      <DiskActionButton onSearchButtonClick={getDiskList} />
      <DiskTable />
    </GridItem>
  );
}

DiskList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DiskList;
