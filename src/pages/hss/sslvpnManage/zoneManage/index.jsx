import { useCallback, useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import Layout from '@components/layouts';
import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setParameters,
  setInterfaceNameList,
} from '@modules/redux/reducers/hss/sslvpn/zone';

import useApi from '@modules/hooks/useApi';
import zoneApi from '@api/hss/sslvpn/zoneApi';
import interfaceApi from '@api/hss/common/networkManage/interfaceApi';

import ZoneSearchForm from '@components/hss/sslvpn/zone/zoneSearchForm';
import ZoneActionButton from '@components/hss/sslvpn/zone/zoneActionButton';
import ZoneTable from '@components/hss/sslvpn/zone/zoneTable';
import HsLib from '@modules/common/HsLib';
import Loader from '@components/mantis/Loader';

function ZoneManage() {
  const { instance, source } = AuthInstance();

  zoneApi.axios = instance;
  interfaceApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.zone);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('ZoneManage', zoneApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });

    getInterfaceNameList();
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

  const getZoneList = async (param) => {
    const { totalElements, content } = await apiCall(zoneApi.getZoneList, param);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      const result = await apiCall(
        zoneApi.deleteZoneData,
        parameterData.deleteList.map((item) => item.id),
      );

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getZoneList({ ...parameterData.parameters.current, page: 0 });
            dispatch(setParameters({ page: 0 }));
            dispatch(setDeleteList([]));
          },
        });
      }
    } else {
      openModal({
        message: `삭제할 항목을 먼저 선택해주세요.`,
      });
    }
  };

  const getInterfaceNameList = useCallback(async () => {
    const data = await apiCall(interfaceApi.getInterfaceColumnList, 'name');
    if (data) {
      const list = data.map((item) => ({
        value: item,
        label: item,
      }));
      dispatch(setInterfaceNameList(list));
    }
  }, []);

  const getLoadingStatus = async (param) => {
    setIsLoading(param);
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
    getZoneList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <ZoneSearchForm />
      <ZoneActionButton
        onSearchButtonClick={getZoneList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      <ZoneTable getZoneList={getZoneList} getLoadingStatus={getLoadingStatus} />
    </GridItem>
  );
}

ZoneManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ZoneManage;
