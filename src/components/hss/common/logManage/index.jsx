import { useEffect, useCallback, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import Loader from '@components/mantis/Loader';

import { AuthInstance } from '@modules/axios';
import {
  setParameters,
  setPageDataList,
  setListInfo,
  setColumns,
  setLogFilter,
  resetState,
} from '@modules/redux/reducers/hss/common/log';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';

import logApi from '@api/hss/common/logManage/logApi';

import SYSTEMLogTable from './SYSTEMLogTable';
import SYSTEMLogSearchForm from './SYSTEMLogSearchForm';
import SYSTEMLogSearchActionButton from './SYSTEMLogSearchActionButton';

function LogList() {
  const { instance, source } = AuthInstance();

  logApi.axios = instance;

  const [apiCall] = useApi();
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.log);
  const { size, page } = parameterData.parameters.current;
  const parameters = parameterData.parameters.current;
  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('LogList', logApi);

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

  const setDefaultLog = async () => {
    // <span style="color: red;">현재 상태가 이미 기본 상태(빈 로그, totalElements 0)라면 dispatch하지 않음</span>
    if (
      Array.isArray(parameterData.pageDataList) &&
      parameterData.pageDataList.length === 0 &&
      Number(parameterData.totalElements) === 0
    ) {
      return;
    }
    const log_list = [];
    const totalElements = 0;
    dispatch(setPageDataList({ pageDataList: log_list, totalElements }));
  };

  const getLogList = useCallback(
    async (param = {}, showModal = false) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const log_name = 'system';
      const log_offset = parameters.page * parameters.size;
      const log_size = parameters.size;
      let log_filter = null;

      if (parameters.searchDate !== '' && parameters.searchString !== '') {
        log_filter = '"(' + parameters.searchDate + ').*(' + parameters.searchString + ')"';
      } else if (parameters.searchDate !== '' && parameters.searchString === '') {
        log_filter = '"' + parameters.searchDate + '"';
      } else if (parameters.searchDate === '' && parameters.searchString !== '') {
        log_filter = '"' + parameters.searchString + '"';
      }

      try {
        const log_data = await apiCall(logApi.getLogList, {
          name: log_name,
          offset: log_offset,
          limit: log_size,
          filter: log_filter,
          type: 'system',
        });

        const jsonData = JSON.parse(log_data);
        const totalElements = jsonData.total_rows;
        const log_list = jsonData.rows.map(({ line, pos, timestamp }) => ({
          LogNo: Number(pos) + 1,
          LogDate: timestamp,
          LogDetail: line,
        }));

        dispatch(setLogFilter(log_filter));
        dispatch(setPageDataList({ pageDataList: log_list, totalElements }));
      } catch (error) {
        setDefaultLog();
      }

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

    dispatch(resetState());
    init();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }

    if (isMount) {
      getLogList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <SYSTEMLogSearchForm />
      <SYSTEMLogSearchActionButton onSearchButtonClick={getLogList} />
      {isMount && <SYSTEMLogTable />}
    </GridItem>
  );
}

export default LogList;
