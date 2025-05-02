import { useState, useEffect, useCallback, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
  setSegmentNameList,
  setTimeNameList,
  resetState,
} from '@modules/redux/reducers/hss/sslswg/policyGroupStatus';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import segmentStatusApi from '@api/hss/sslva/policy/segmentStatusApi';
import policyGroupStatusApi from '@api/hss/sslswg/policy/policyGroupStatusApi';
import timeStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeStatusApi';
import timeGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeGroupStatusApi';

import PolicyGroupStatusSearchForm from './policyGroupStatusSearchForm';
import PolicyGroupStatusActionButton from './policyGroupStatusActionButton';
import PolicyGroupStatusTable from './policyGroupStatusTable';
import HsLib from '@modules/common/HsLib';

function PolicyGroupStatus() {
  const { instance, source } = AuthInstance();

  policyGroupStatusApi.axios = instance;
  segmentStatusApi.axios = instance;
  timeStatusApi.axios = instance;
  timeGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.swgPolicyGroupStatus);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const [gridInfo, segmentData, singleListResult, groupListResult] = await Promise.all([
      HsLib.getGridInfo('SWGPolicyGroupStatusList', policyGroupStatusApi),
      apiCall(segmentStatusApi.getSegmentStatusColumnList, 'name'),
      apiCall(timeStatusApi.getTimeStatusList, { contentOnly: true }),
      apiCall(timeGroupStatusApi.getTimeGroupStatusList, { contentOnly: true }),
    ]);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);

      if (Array.isArray(segmentData)) {
        const list = segmentData.map((item) => ({
          value: item,
          label: item,
        }));
        dispatch(setSegmentNameList(list));
      }

      const singleList = (Array.isArray(singleListResult) ? singleListResult : []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      const groupList = (Array.isArray(groupListResult) ? groupListResult : []).map((item) => ({
        value: item.id,
        label: `${item.name} (G)`,
      }));

      dispatch(setTimeNameList([...groupList, ...singleList]));
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

  const getPolicyGroupStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        policyGroupStatusApi.getPolicyGroupStatusList,
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
        policyGroupStatusApi.deletePolicyGroupStatusData,
        parameterData.deleteList.map((item) => item.id),
      );
      setIsLoading(false);
      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getPolicyGroupStatusList({ ...parameterData.parameters.current, page: 0 });
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
      getPolicyGroupStatusList(parameterData.parameters.current);
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
      <PolicyGroupStatusSearchForm />
      <PolicyGroupStatusActionButton
        onSearchButtonClick={getPolicyGroupStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && <PolicyGroupStatusTable />}
    </GridItem>
  );
}

export default PolicyGroupStatus;
