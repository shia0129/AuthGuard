import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import {
  setParameters,
  setColumns,
  setListInfo,
  setPageDataList,
  setDeleteList,
} from '@modules/redux/reducers/ipGroupStatus';
import ipGroupStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/ipGroupStatusApi';
import IpGroupStatusSearchForm from './ipGroupStatusSearchForm';
import IpGroupStatusActionButton from './ipGroupStatusActionButton';
import IpGroupStatusTable from './ipGroupStatusTable';
import HsLib from '@modules/common/HsLib';

function IpGroupStatus() {
  const { instance, source } = AuthInstance();

  ipGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.ipGroupStatus);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('IpGroupStatus', ipGroupStatusApi);

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

  const getIpGroupStatusList = async (param) => {
    const { totalElements, content } = await apiCall(ipGroupStatusApi.getIpGroupStatusList, param);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      const result = await apiCall(
        ipGroupStatusApi.deleteIpGroupStatusData,
        parameterData.deleteList.map((item) => item.id),
      );

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getIpGroupStatusList({ ...parameterData.parameters.current, page: 0 });
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
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
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
    getIpGroupStatusList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <IpGroupStatusSearchForm />
      <IpGroupStatusActionButton
        onSearchButtonClick={getIpGroupStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      <IpGroupStatusTable getIpGroupStatusList={getIpGroupStatusList} />
    </GridItem>
  );
}

export default IpGroupStatus;
