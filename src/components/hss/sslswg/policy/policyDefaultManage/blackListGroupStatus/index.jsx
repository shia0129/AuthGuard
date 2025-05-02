import { useCallback, useEffect, useState, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setListInfo,
  setParameters,
  setPageDataList,
  setCheckList,
  resetState,
} from '@modules/redux/reducers/hss/sslswg/blackListGroupStatus';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import blackListGroupStatusApi from '@api/hss/sslswg/policy/policyDefaultManage/blackListGroupStatusApi';
import BlackListGroupStatusSearchForm from './blackListGroupStatusSearchForm';
import BlackListGroupStatusActionButton from './blackListGroupStatusActionButton';
import BlackListGroupStatusTable from './blackListGroupStatusTable';
import HsLib from '@modules/common/HsLib';

function BlackListGroupStatus() {
  const { instance, source } = AuthInstance();

  blackListGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.blackListGroupStatus);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('BlackListGroupStatusList', blackListGroupStatusApi);

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

  const getBlackListGroupStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        blackListGroupStatusApi.getBlackListGroupStatusList,
        param,
      );

      dispatch(setPageDataList({ pageDataList: content, totalElements }));

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleChangeBlackListStatus = async (enabled) => {
    const { checkList, parameters } = parameterData;

    if (checkList.length === 0) {
      return openModal({
        message: `변경할 항목을 먼저 선택해주세요.`,
      });
    }

    setIsLoading(true);
    const result = await apiCall(blackListGroupStatusApi.updateEnabledBlackListGroupStatusData, {
      data: checkList.map((item) => item.id),
      enabled: enabled,
    });
    setIsLoading(false);
    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          getBlackListGroupStatusList({ ...parameters.current, page: 0 });
          dispatch(setParameters({ page: 0 }));
          dispatch(setCheckList([]));
        },
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
      getBlackListGroupStatusList(parameterData.parameters.current);
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
      <BlackListGroupStatusSearchForm />
      <BlackListGroupStatusActionButton
        onSearchButtonClick={getBlackListGroupStatusList}
        onEnabledButtonClick={() => handleChangeBlackListStatus(true)}
        onDisabledButtonClick={() => handleChangeBlackListStatus(false)}
      />
      {isMount && <BlackListGroupStatusTable />}
    </GridItem>
  );
}

export default BlackListGroupStatus;
