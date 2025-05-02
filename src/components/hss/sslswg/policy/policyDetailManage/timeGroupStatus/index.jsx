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
} from '@modules/redux/reducers/hss/sslswg/time/timeGroupStatus';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import timeGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeGroupStatusApi';
import TimeGroupStatusSearchForm from './timeGroupStatusSearchForm';
import TimeGroupStatusActionButton from './timeGroupStatusActionButton';
import TimeGroupStatusTable from './timeGroupStatusTable';
import HsLib from '@modules/common/HsLib';

function TimeGroupStatus() {
  const { instance, source } = AuthInstance();

  timeGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.timeGroupStatus);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('TimeGroupList', timeGroupStatusApi);

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

  const getTimeGroupStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        timeGroupStatusApi.getTimeGroupStatusList,
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
        timeGroupStatusApi.deleteTimeGroupStatusData,
        parameterData.deleteList.map((item) => item.id),
      );
      setIsLoading(false);
      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getTimeGroupStatusList({ ...parameterData.parameters.current, page: 0 });
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
      getTimeGroupStatusList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <TimeGroupStatusSearchForm />
      <TimeGroupStatusActionButton
        onSearchButtonClick={getTimeGroupStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && <TimeGroupStatusTable getTimeGroupStatusList={getTimeGroupStatusList} />}
    </GridItem>
  );
}

export default TimeGroupStatus;
