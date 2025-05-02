import { useEffect, useRef, useState, useCallback } from 'react';
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
  setProtocolTypeList,
  resetState,
} from '@modules/redux/reducers/hss/sslva/protocolStatus';
import useApi from '@modules/hooks/useApi';

import protocolStatusApi from '@api/hss/sslva/policy/protocolStatusApi';
import ProtocolStatusSearchForm from './protocolStatusSearchForm';
import ProtocolStatusActionButton from './protocolStatusActionButton';
import ProtocolStatusTable from './protocolStatusTable';
import HsLib from '@modules/common/HsLib';
import Loader from '@components/mantis/Loader';

function ProtocolStatus() {
  // 삭제 시 상위 uuid 등록되어 있는 지 확인 -> 있으면 삭제 불가
  const { instance, source } = AuthInstance();

  protocolStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.protocolStatus);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const [gridInfo, protocolTypeList] = await Promise.all([
      HsLib.getGridInfo('ProtocolStatusList', protocolStatusApi),
      apiCall(protocolStatusApi.getProtocolTypeList),
    ]);

    if (protocolTypeList) {
      if (Array.isArray(protocolTypeList)) {
        const formattedList =
          protocolTypeList.map(({ id, name }) => ({
            value: id,
            label: name.toUpperCase(),
          })) ?? [];

        if (formattedList.length > 0) {
          dispatch(setProtocolTypeList(formattedList));
        }
      }
    }

    if (gridInfo) {
      unstable_batchedUpdates(() => {
        responseGridInfo(gridInfo);
      });
    }

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

  const getProtocolStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        protocolStatusApi.getProtocolStatusList,
        param,
      );

      dispatch(setPageDataList({ pageDataList: content, totalElements }));

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      setIsLoading(true);

      const result = await apiCall(
        protocolStatusApi.deleteProtocolStatusData,
        parameterData.deleteList.map((item) => item.id),
      );

      setIsLoading(false);

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getProtocolStatusList({ ...parameterData.parameters.current, page: 0 });
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isMount) {
      getProtocolStatusList(parameterData.parameters.current);
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
      <ProtocolStatusSearchForm />
      <ProtocolStatusActionButton
        onSearchButtonClick={getProtocolStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && <ProtocolStatusTable getProtocolStatusList={getProtocolStatusList} />}
    </GridItem>
  );
}

export default ProtocolStatus;
