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
  setDeleteList,
  resetState,
} from '@modules/redux/reducers/hss/sslswg/pattern/patternGroupUpdateStatus';
import useApi from '@modules/hooks/useApi';

import patternGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/patternGroupStatusApi';
import PatternGroupUpdateStatusSearchForm from './patternGroupUpdateStatusSearchForm';
import PatternGroupUpdateStatusActionButton from './patternGroupUpdateStatusActionButton';
import PatternGroupUpdateStatusTable from './patternGroupUpdateStatusTable';
import HsLib from '@modules/common/HsLib';
import { useRouter } from 'next/router';
import Loader from '@components/mantis/Loader';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack, Typography } from '@mui/material';

function PatternGroupUpdateStatus() {
  const { instance, source } = AuthInstance();

  patternGroupStatusApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const parameterData = useSelector((state) => state.patternGroupUpdateStatus);
  const { size, page } = parameterData.parameters.current;
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const [formData, setFormdata] = useState({
    name: '',
    type: '',
    action: '',
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('PatternGroupUpdateList', patternGroupStatusApi);
    const result = await apiCall(patternGroupStatusApi.getPatternGroupStatusDetails, id);

    unstable_batchedUpdates(() => {
      dispatch(setParameters({ id: id }));
      responseGridInfo(gridInfo);

      if (result) {
        setFormdata({
          name: result.name,
          type: result.type,
          action: result.action,
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

  const getPatternGroupUpdateStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!param.id) {
        param = { ...param, id };
      }
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        patternGroupStatusApi.getMappingListAllWithPatternGroupId,
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
      if (!useEffect_0003.current) {
        useEffect_0003.current = true;
        return;
      }
    }

    if (isMount) {
      getPatternGroupUpdateStatusList(parameterData.parameters.current);
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
          <Typography variant="title2">패턴 그룹 정책 수정</Typography>
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
              label="그룹명"
              name="name"
              value={formData.name}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="유형"
              name="type"
              list={[
                { label: 'HEADER', value: 'regexpheader' },
                { label: 'PAYLOAD', value: 'regexppayload' },
                { label: 'URL', value: 'regexurl' },
              ]}
              value={formData.type}
              disabled
              labelBackgroundFlag
            />
            <LabelInput
              type="select"
              label="처리 방식"
              name="action"
              list={[
                { label: '차단', value: '0' },
                { label: '허용', value: '1' },
              ]}
              value={formData.action}
              disabled
              labelBackgroundFlag
            />
          </GridItem>
        </Stack>
      </GridItem>
      <PatternGroupUpdateStatusSearchForm />
      <PatternGroupUpdateStatusActionButton onSearchButtonClick={getPatternGroupUpdateStatusList} />
      {isMount && <PatternGroupUpdateStatusTable />}
    </GridItem>
  );
}

export default PatternGroupUpdateStatus;
