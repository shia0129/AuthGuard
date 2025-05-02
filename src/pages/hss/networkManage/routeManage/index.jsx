import { useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import Layout from '@components/layouts';

import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setParameters,
  // setInterfaceNameList,
  resetState,
} from '@modules/redux/reducers/hss/common/route';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import routeApi from '@api/hss/common/networkManage/routeApi';
import interfaceApi from '@api/hss/common/networkManage/interfaceApi';

import RouteSearchForm from '@components/hss/common/networkManage/route/routeSearchForm';
import RouteActionButton from '@components/hss/common/networkManage/route/routeActionButton';
import RouteTable from '@components/hss/common/networkManage/route/routeTable';
import HsLib from '@modules/common/HsLib';

import _ from 'lodash';

function RouteManage() {
  const { instance, source } = AuthInstance();

  routeApi.axios = instance;
  interfaceApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.route);
  const { size, page } = parameterData.parameters.current;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const [gridInfo] = await Promise.all([HsLib.getGridInfo('RouteList', routeApi)]);

    // const [gridInfo, interfaces] = await Promise.all([
    //   HsLib.getGridInfo('RouteList', routeApi),
    //   apiCall(interfaceApi.getInterfaceList, { contentOnly: true }),
    // ]);
    // const formattedInterfaces = Array.isArray(interfaces)
    //   ? interfaces
    //       .filter(({ member }) => !member || member === 'MNGT') // 소속 없거나 MNGT
    //       .map(({ name }) => ({
    //         value: name,
    //         label: name,
    //       }))
    //   : [];

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
      // if (Array.isArray(formattedInterfaces) && formattedInterfaces.length) {
      //   dispatch(setInterfaceNameList(formattedInterfaces));
      // }
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

  const getRouteList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(routeApi.getRouteList, param);
      if (content) {
        const formatted = content.map((item) => ({
          id: item.name, // name이 유니크한 값이라는 전제
          ...item,
        }));

        dispatch(setPageDataList({ pageDataList: formatted, totalElements }));
      }

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleDelete = async () => {
    const deleteItems = parameterData.deleteList;
    if (!deleteItems.length) {
      return openModal({ message: '삭제할 항목을 먼저 선택해주세요.' });
    }

    setIsLoading(true);

    const result = await apiCall(
      routeApi.deleteRouteData,
      deleteItems.map((item) => item.id),
    );

    console.log(result);

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          dispatch(setDeleteList([]));
          dispatch(setParameters({ page: 0 }));
          getRouteList({ ...parameterData.parameters.current, page: 0 });
        },
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
      getRouteList(parameterData.parameters.current);
    }
  }, [isMount, size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <RouteSearchForm />
      <RouteActionButton onSearchButtonClick={getRouteList} onDeleteButtonClick={handleDelete} />
      {isMount && <RouteTable getRouteList={getRouteList} />}
    </GridItem>
  );
}

RouteManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default RouteManage;
