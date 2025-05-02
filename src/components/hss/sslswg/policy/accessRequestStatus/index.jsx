import TabTheme from '@components/modules/tab/TabTheme';

import { useState, useEffect, useCallback, useRef } from 'react';
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
} from '@modules/redux/reducers/hss/sslswg/accessRequestStatus';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import Loader from '@components/mantis/Loader';

import accessRequestStatusApi from '@api/hss/sslswg/policy/accessRequestStatusApi';
import AccessRequestSearchForm from './accessRequestSearchForm';
import AccessRequestActionButton from './accessRequestActionButton';
import AccessRequestTable from './accessRequestTable';

const tabList = [
  {
    label: '요청 대기',
    value: 'wait',
  },
  {
    label: '승인 완료',
    value: 'done',
  },
];

function AccessRequestStatus() {
  const [tabValues, setTabValues] = useState('wait');

  const { instance, source } = AuthInstance();
  accessRequestStatusApi.axios = instance;
  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.accessRequestStatus[tabValues]);
  const { size, page } = parameterData.parameters.current;
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const [_waitGridInfo, _doneGridInfo] = await Promise.all([
      HsLib.getGridInfo('AccessRequestWaitList', accessRequestStatusApi),
      HsLib.getGridInfo('AccessRequestDoneList', accessRequestStatusApi),
    ]);

    unstable_batchedUpdates(() => {
      responseGridInfo(_waitGridInfo, 'wait');
      responseGridInfo(_doneGridInfo, 'done');
    });

    setIsMount(true);
  };

  const responseGridInfo = (p_gridInfo, tabValue) => {
    dispatch(setColumns({ tab: tabValue, columns: p_gridInfo.columns }));
    dispatch(setListInfo({ tab: tabValue, listInfo: p_gridInfo.listInfo }));
    dispatch(
      setParameters({
        tab: tabValue,
        data: { size: Number(p_gridInfo.listInfo.size) },
      }),
    );
  };

  const getAccessRequestList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        accessRequestStatusApi.getAccessRequestStatusList,
        {
          ...param,
          mode: tabValues, // "wait" 또는 "done"
        },
      );

      dispatch(
        setPageDataList({
          tab: tabValues,
          pageDataList: content,
          totalElements,
        }),
      );

      setIsLoading(false);
    },
    [isMount, tabValues, apiCall, dispatch],
  );

  const handleChangeAccessRequestStatus = async (isAllow) => {
    const { checkList } = parameterData;
    const statusText = isAllow ? '허용' : '반려';
    const inUsedValue = isAllow ? '1' : '2';

    if (checkList.length === 0) {
      return openModal({
        message: `${statusText}할 항목을 먼저 선택해주세요.`,
      });
    }

    const ids = checkList.map((item) => item.id);

    openModal({
      message: `선택한 항목을 ${statusText} 처리하시겠습니까?`,
      onConfirm: () => {
        handleAccessRequestAction(ids, inUsedValue);
      },
    });
  };

  const handleAccessRequestAction = async (ids, inUsedValue) => {
    setIsLoading(true);

    const result = await apiCall(accessRequestStatusApi.updateAccessRequestStatus, {
      reasonIdList: ids,
      inUsed: inUsedValue,
    });

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          getAccessRequestList({
            ...parameterData.parameters.current,
            page: 0,
          });

          dispatch(
            setParameters({
              tab: tabValues,
              data: { page: 0 },
            }),
          );

          dispatch(
            setCheckList({
              tab: tabValues,
              checkList: [],
            }),
          );
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
      getAccessRequestList(parameterData.parameters.current);
    }
  }, [tabValues, isMount, size, page]);

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
    <>
      {isLoading && <Loader isGuard />}
      <TabTheme
        tabsValue={tabValues}
        onChange={(_, newValue) => {
          setTabValues(newValue);
        }}
        tabOutline
        tabList={tabList}
      />
      <GridItem spacing={2} container direction="column">
        <AccessRequestSearchForm tableName={tabValues} />
        <AccessRequestActionButton
          onSearchButtonClick={getAccessRequestList}
          onAllowClick={() => handleChangeAccessRequestStatus(true)}
          onRejectClick={() => handleChangeAccessRequestStatus(false)}
          tableName={tabValues}
        />
        {isMount && <AccessRequestTable tableName={tabValues} />}
      </GridItem>
    </>
  );
}

export default AccessRequestStatus;
