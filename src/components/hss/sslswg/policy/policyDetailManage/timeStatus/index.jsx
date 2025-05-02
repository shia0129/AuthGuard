import { useEffect, useRef, useCallback, useState } from 'react';
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
  resetState,
} from '@modules/redux/reducers/hss/sslswg/time/timeStatus';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import timeStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeStatusApi';
import TimeStatusSearchForm from './timeStatusSearchForm';
import TimeStatusActionButton from './timeStatusActionButton';
import TimeStatusTable from './timeStatusTable';
import HsLib from '@modules/common/HsLib';

function TimeStatus() {
  const { instance, source } = AuthInstance();

  timeStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.timeStatus);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('TimeList', timeStatusApi);

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

  const getTimeStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(timeStatusApi.getTimeStatusList, param);

      dispatch(setPageDataList({ pageDataList: content, totalElements }));

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      setIsLoading(true);
      const result = await apiCall(
        timeStatusApi.deleteTimeStatusData,
        parameterData.deleteList.map((item) => item.id),
      );
      setIsLoading(false);
      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getTimeStatusList({ ...parameterData.parameters.current, page: 0 });
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isMount) {
      getTimeStatusList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <TimeStatusSearchForm />
      <TimeStatusActionButton
        onSearchButtonClick={getTimeStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && <TimeStatusTable getTimeStatusList={getTimeStatusList} />}
    </GridItem>
  );
}

export default TimeStatus;
