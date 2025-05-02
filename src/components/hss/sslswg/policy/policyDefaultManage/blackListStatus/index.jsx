'use client';
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
} from '@modules/redux/reducers/hss/sslswg/blackListStatus';
import useApi from '@modules/hooks/useApi';

import blackListStatusApi from '@api/hss/sslswg/policy/policyDefaultManage/blackListStatusApi';
import BlackListStatusSearchForm from './blackListStatusSearchForm';
import BlackListStatusActionButton from './blackListStatusActionButton';
import BlackListStatusTable from './blackListStatusTable';
import HsLib from '@modules/common/HsLib';
import { useRouter } from 'next/router';
import Loader from '@components/mantis/Loader';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack, Typography } from '@mui/material';
import blackListGroupStatusApi from '@api/hss/sslswg/policy/policyDefaultManage/blackListGroupStatusApi';

function BlackListStatus() {
  const { instance, source } = AuthInstance();

  blackListStatusApi.axios = instance;
  blackListGroupStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const parameterData = useSelector((state) => state.blackListStatus);
  const { size, page } = parameterData.parameters.current;
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const [formData, setFormdata] = useState({
    name: '',
    category: '',
    enabled: 1,
  });

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);

  const init = async () => {
    const [gridInfo, blackListResult] = await Promise.all([
      HsLib.getGridInfo('BlackListStatusList', blackListStatusApi),
      apiCall(blackListGroupStatusApi.getBlackListGroupStatusDetails, id),
    ]);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo, id);
      if (blackListResult) {
        setFormdata({
          name: blackListResult.name || '',
          category: blackListResult.category || '',
          enabled: blackListResult.enabled ?? 1,
        });
      }
    });

    setIsMount(true);
  };

  const responseGridInfo = (p_gridInfo, id) => {
    dispatch(setColumns(p_gridInfo.columns));
    dispatch(setListInfo(p_gridInfo.listInfo));
    dispatch(
      setParameters({
        id: id,
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getBlackListStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!param?.id || param.id === '') return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        blackListStatusApi.getBlackListStatusList,
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

    const result = await apiCall(blackListStatusApi.updateEnabledBlackListStatusData, {
      data: checkList.map((item) => item.id),
      enabled: enabled,
    });

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          getBlackListStatusList({ ...parameters.current, page: 0 });
          dispatch(setParameters({ page: 0 }));
          dispatch(setCheckList([]));
        },
      });
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0003.current) {
        useEffect_0003.current = true;
        return;
      }
    }

    if (isMount) {
      getBlackListStatusList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (id) {
      dispatch(resetState());
      init();
    }
  }, [id]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    return () => {
      source.cancel();
    };
  }, []);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <GridItem item>
        <Stack spacing={2}>
          <Typography variant="title2">블랙리스트 수정</Typography>
          <GridItem
            item
            directionHorizon="end"
            divideColumn={3}
            borderFlag
            sx={{
              '& .text': { maxWidth: '180px !important', minWidth: '180px !important' },
              '.inputBox': { maxWidth: '250px', minWidth: '250px' },
              // mb: 2,
            }}
          >
            <LabelInput
              required
              label="정책명"
              name="name"
              value={formData.name}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              label="카테고리"
              name="category"
              value={formData.category}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="활성화 여부"
              name="enabled"
              list={[
                { value: 1, label: '활성화' },
                { value: 0, label: '비활성화' },
              ]}
              value={formData.enabled}
              disabled
              labelBackgroundFlag
            />
          </GridItem>
        </Stack>
      </GridItem>
      <BlackListStatusSearchForm />
      <BlackListStatusActionButton
        onSearchButtonClick={getBlackListStatusList}
        onEnabledButtonClick={() => handleChangeBlackListStatus(true)}
        onDisabledButtonClick={() => handleChangeBlackListStatus(false)}
      />
      {isMount && <BlackListStatusTable />}
    </GridItem>
  );
}

export default BlackListStatus;
