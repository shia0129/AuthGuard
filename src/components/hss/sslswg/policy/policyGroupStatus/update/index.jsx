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
  resetState,
} from '@modules/redux/reducers/hss/sslswg/policyGroupUpdateStatus';
import useApi from '@modules/hooks/useApi';

import policyGroupStatusApi from '@api/hss/sslswg/policy/policyGroupStatusApi';
import PolicyGroupUpdateStatusSearchForm from './policyGroupUpdateStatusSearchForm';
import PolicyGroupUpdateStatusActionButton from './policyGroupUpdateStatusActionButton';
import PolicyGroupUpdateStatusTable from './policyGroupUpdateStatusTable';
import HsLib from '@modules/common/HsLib';
import { useRouter } from 'next/router';
import Loader from '@components/mantis/Loader';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack, Typography } from '@mui/material';

function PolicyGroupUpdateStatus() {
  const { instance, source } = AuthInstance();

  policyGroupStatusApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const parameterData = useSelector((state) => state.swgPolicyGroupUpdateStatus);
  const { size, page } = parameterData.parameters.current;
  const { segmentNameList, timeNameList } = useSelector((state) => state.swgPolicyGroupStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const [formData, setFormdata] = useState({
    name: '',
    segmentName: '',
    timeId: '',
    isBlackList: '',
    action: '',
    description: '',
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo(
      'SWGPolicyGroupUpdateStatusList',
      policyGroupStatusApi,
    );
    const result = await apiCall(policyGroupStatusApi.getPolicyGroupStatusDetails, id);

    unstable_batchedUpdates(() => {
      dispatch(setParameters({ id: id }));
      responseGridInfo(gridInfo);
      if (result) {
        setFormdata({
          name: result.name ?? '',
          segmentName: result.segmentName ?? '',
          timeId: result.timeId ?? '',
          isBlackList: result.isBlackList === 1 ? String(result.isBlackList) : '',
          action: String(result.action ?? ''),
          description: result.description ?? '',
        });
      }
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

  const getPolicyGroupUpdateStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!param?.id || param.id === '') return;
      if (!isLoading) {
        setIsLoading(true);
      }
      const { totalElements, content } = await apiCall(
        policyGroupStatusApi.getMappingListAllWithPolicyGroupId,
        param,
      );
      dispatch(setPageDataList({ pageDataList: content, totalElements }));
      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
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
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    if (isMount) {
      getPolicyGroupUpdateStatusList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0003.current) {
        useEffect_0003.current = true;
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
          <Typography variant="title2">정책 그룹 수정</Typography>
          <GridItem
            item
            directionHorizon="end"
            divideColumn={3}
            borderFlag
            sx={{
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
              // mb: 2,
            }}
          >
            <LabelInput
              required
              label="그룹명"
              name="name"
              value={formData?.name}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="SSL VA<br/>[세그먼트]"
              name="segmentName"
              value={formData?.segmentName}
              list={segmentNameList || []}
              labelSx={{ textAlign: 'right' }}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              required
              type="select"
              label="처리 방식"
              name="action"
              value={formData?.action || ''}
              list={[
                { label: '차단', value: '0' },
                { label: '허용', value: '1' },
              ]}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="스케줄 정책"
              name="timeId"
              value={formData?.timeId || ''}
              list={timeNameList ?? []}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="블랙리스트 정책"
              name="isBlackList"
              value={formData?.isBlackList || ''}
              list={[{ label: '적용', value: '1' }]}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              label="설명"
              name="description"
              value={formData?.description}
              disabled
              labelBackgroundFlag
            />
          </GridItem>
        </Stack>
      </GridItem>
      <PolicyGroupUpdateStatusSearchForm />
      <PolicyGroupUpdateStatusActionButton onSearchButtonClick={getPolicyGroupUpdateStatusList} />
      {isMount && <PolicyGroupUpdateStatusTable />}
    </GridItem>
  );
}

export default PolicyGroupUpdateStatus;
