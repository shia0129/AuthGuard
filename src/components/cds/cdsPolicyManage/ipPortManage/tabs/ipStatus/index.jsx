import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setListInfo,
  setParameters,
  setPageDataList,
  setDeleteList,
} from '@modules/redux/reducers/ipStatus';
import useApi from '@modules/hooks/useApi';

import ipStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/ipStatusApi';
import IpStatusSearchForm from './ipStatusSearchForm';
import IpStatusActionButton from './ipStatusActionButton';
import IpStatusTable from './ipStatusTable';
import HsLib from '@modules/common/HsLib';

function IpStatus() {
  const { instance, source } = AuthInstance();

  ipStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.ipStatus);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('IpStatusList', ipStatusApi);

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

  const getIpStatusList = async (param) => {
    const { totalElements, content } = await apiCall(ipStatusApi.getIpStatusList, param);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      const result = await apiCall(
        ipStatusApi.deleteIpStatusData,
        parameterData.deleteList.map((item) => item.id),
      );

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getIpStatusList({ ...parameterData.parameters.current, page: 0 });
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
    getIpStatusList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <IpStatusSearchForm />
      <IpStatusActionButton
        onSearchButtonClick={getIpStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      <IpStatusTable getIpStatusList={getIpStatusList} />
    </GridItem>
  );
}

export default IpStatus;
