import { useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import Layout from '@components/layouts';

import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
  setInterfaceNameList,
  setInterfaceMemberList,
  setInterfaceTypeList,
  resetState,
} from '@modules/redux/reducers/hss/common/interfaceModule';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import interfaceApi from '@api/hss/common/networkManage/interfaceApi';
import InterfaceSearchForm from '@components/hss/common/networkManage/interface/interfaceSearchForm';
import InterfaceActionButton from '@components/hss/common/networkManage/interface/interfaceActionButton';
import InterfaceTable from '@components/hss/common/networkManage/interface/interfaceTable';
import HsLib from '@modules/common/HsLib';

import _ from 'lodash';

function InterfaceManage() {
  const { instance, source } = AuthInstance();

  interfaceApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.interfaceModule);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('InterfaceList', interfaceApi);
    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
    getInterfaceNameList();
    getInterfaceMemberList();
    getInterfaceTypeList();

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

  const getInterfaceList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(interfaceApi.getInterfaceList, param);
      if (content) {
        dispatch(setPageDataList({ pageDataList: content, totalElements }));
      }

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const getInterfaceNameList = useCallback(async () => {
    const data = await apiCall(interfaceApi.getInterfaceColumnList, 'name');
    if (data) {
      const list = data.map((item) => ({
        value: item,
        label: item,
      }));
      dispatch(setInterfaceNameList(list));
    }
  }, []);

  const getInterfaceMemberList = useCallback(async () => {
    const data = await apiCall(interfaceApi.getInterfaceMemberList, 'member');
    if (data) {
      const list = data.map((item) => ({
        value: item,
        label: item,
      }));
      dispatch(setInterfaceMemberList(list));
    }
  }, []);

  const getInterfaceTypeList = useCallback(async () => {
    const data = await apiCall(interfaceApi.getInterfaceColumnList, 'type');
    if (data) {
      const uniqueData = _.uniq(data); // 중복값 제거
      const list = uniqueData.map((item) => ({
        value: item,
        label: item,
      }));
      dispatch(setInterfaceTypeList(list));
    }
  }, []);

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
      getInterfaceList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <InterfaceSearchForm />
      <InterfaceActionButton onSearchButtonClick={getInterfaceList} />
      {isMount && <InterfaceTable getInterfaceList={getInterfaceList} />}
    </GridItem>
  );
}

InterfaceManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default InterfaceManage;
