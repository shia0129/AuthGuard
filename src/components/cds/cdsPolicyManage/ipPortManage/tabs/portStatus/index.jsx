import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/portStatus';
import useApi from '@modules/hooks/useApi';

import portStatusApi from '@api/cds/cdsPolicyManage/ipPortManage/portStatusApi';
import PortStatusSearchForm from './portStatusSearchForm';
import PortStatusActionButton from './portStatusActionButton';
import PortStatusTable from './portStatusTable';
import HsLib from '@modules/common/HsLib';

function PortStatus() {
  const { instance, source } = AuthInstance();

  portStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.portStatus);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('PortStatusList', portStatusApi);

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

  const getPortStatusList = async (param) => {
    const { totalElements, content } = await apiCall(portStatusApi.getPortStatusList, param);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      const result = await apiCall(
        portStatusApi.deletePortStatusData,
        parameterData.deleteList.map((item) => item.id),
      );

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getPortStatusList({ ...parameterData.parameters.current, page: 0 });
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
    getPortStatusList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <PortStatusSearchForm />
      <PortStatusActionButton
        onSearchButtonClick={getPortStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      <PortStatusTable getPortStatusList={getPortStatusList} />
    </GridItem>
  );
}

export default PortStatus;
