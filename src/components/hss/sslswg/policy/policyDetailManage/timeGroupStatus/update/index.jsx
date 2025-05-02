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
} from '@modules/redux/reducers/hss/sslswg/time/timeGroupUpdateStatus';
import useApi from '@modules/hooks/useApi';

import timeGroupStatusApi from '@api/hss/sslswg/policy/policyDetailManage/timeGroupStatusApi';
import TimeGroupUpdateStatusSearchForm from './timeGroupUpdateStatusSearchForm';
import TimeGroupUpdateStatusActionButton from './timeGroupUpdateStatusActionButton';
import TimeGroupUpdateStatusTable from './timeGroupUpdateStatusTable';
import HsLib from '@modules/common/HsLib';
import { useRouter } from 'next/router';
import Loader from '@components/mantis/Loader';
import LabelInput from '@components/modules/input/LabelInput';
import { Stack, Typography } from '@mui/material';

function TimeGroupUpdateStatus() {
  const { instance, source } = AuthInstance();

  timeGroupStatusApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const parameterData = useSelector((state) => state.timeGroupUpdateStatus);
  const { size, page } = parameterData.parameters.current;
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const [formData, setFormdata] = useState({
    name: '',
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('TimeGroupUpdateList', timeGroupStatusApi);
    const result = await apiCall(timeGroupStatusApi.getTimeGroupStatusDetails, id);

    unstable_batchedUpdates(() => {
      dispatch(setParameters({ id: id }));
      responseGridInfo(gridInfo);

      if (result) {
        setFormdata({
          name: result.name,
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

  const getTimeGroupUpdateStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!param.id) {
        param = { ...param, id };
      }
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        timeGroupStatusApi.getMappingListAllWithTimeGroupId,
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
      getTimeGroupUpdateStatusList(parameterData.parameters.current);
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
          <Typography variant="title2">스케줄 그룹 정책 수정</Typography>
          <GridItem
            item
            directionHorizon="end"
            divideColumn={1}
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
          </GridItem>
        </Stack>
      </GridItem>
      <TimeGroupUpdateStatusSearchForm />
      <TimeGroupUpdateStatusActionButton onSearchButtonClick={getTimeGroupUpdateStatusList} />
      {isMount && <TimeGroupUpdateStatusTable />}
    </GridItem>
  );
}

export default TimeGroupUpdateStatus;
