import { useState, useEffect, useCallback, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setBridgeList,
  setLinkedList,
  setParameters,
  resetState,
} from '@modules/redux/reducers/hss/sslva/segmentStatus';
import useApi from '@modules/hooks/useApi';

import interfaceApi from '@api/hss/common/networkManage/interfaceApi';
import segmentStatusApi from '@api/hss/sslva/policy/segmentStatusApi';

import SegmentStatusSearchForm from './segmentStatusSearchForm';
import SegmentStatusActionButton from './segmentStatusActionButton';
import SegmentStatusTable from './segmentStatusTable';
import HsLib from '@modules/common/HsLib';
import Loader from '@components/mantis/Loader';

function SegmentStatus() {
  const { instance, source } = AuthInstance();

  segmentStatusApi.axios = instance;
  interfaceApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.segmentStatus);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const [gridInfo, getInterfaceList] = await Promise.all([
      HsLib.getGridInfo('SegmentStatusList', segmentStatusApi),
      apiCall(interfaceApi.getInterfaceList, { contentOnly: true }),
    ]);

    if (getInterfaceList) {
      const bridgelist = getInterfaceList
        .filter((item) => item.type !== 'bridge' && item.member !== 'Linked')
        .map((item) => ({
          value: item.name,
          label: item.name,
        }));
      dispatch(setBridgeList(bridgelist));

      const linkedlist = getInterfaceList
        .filter((item) => item.type !== 'bridge' && item.member === 'Linked')
        .map((item) => ({
          value: item.name,
          label: item.name,
        }));
      dispatch(setLinkedList(linkedlist));
    }

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });

    setIsMount(true);
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

  const getSegmentStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        segmentStatusApi.getSegmentStatusList,
        param,
      );
      /*
        //console.log("content:", content);
        console.log("network IP: ", content[0].network);
        content[0].network['ipaddr-v4'] = "in:10.10.0.254\nout:192.168.168.206";
        content[0].network['subnet'] = "in:255.255.255.0\nout:255.255.255.0";
        content[0].network['gateway'] = "in:-\nout:192.168.168.254";
        console.log("network IP: ", content[0].network['ipaddr-v4']);
    */
        console.log(content);
      dispatch(setPageDataList({ pageDataList: content, totalElements }));

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      setIsLoading(true);

      const result = await apiCall(
        segmentStatusApi.deleteSegmentStatusData,
        parameterData.deleteList.map((item) => item.id),
      );

      setIsLoading(false);

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getSegmentStatusList({ ...parameterData.parameters.current, page: 0 });
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

  const getLoadingStatus = async (param) => {
    setIsLoading(param);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isMount) {
      getSegmentStatusList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    dispatch(resetState());
    init();
    return () => {
      source.cancel();
    };
  }, []);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <SegmentStatusSearchForm />
      <SegmentStatusActionButton
        onSearchButtonClick={getSegmentStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && (
        <SegmentStatusTable
          getSegmentStatusList={getSegmentStatusList}
          getLoadingStatus={getLoadingStatus}
        />
      )}
    </GridItem>
  );
}

export default SegmentStatus;
