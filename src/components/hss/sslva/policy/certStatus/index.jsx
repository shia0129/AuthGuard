import { useEffect, useRef, useCallback, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setParameters,
  resetState,
} from '@modules/redux/reducers/hss/sslva/certStatus';
import useApi from '@modules/hooks/useApi';
import Loader from '@components/mantis/Loader';

import certStatusApi from '@api/hss/sslva/policy/certStatusApi';
import CertStatusSearchForm from './certStatusSearchForm';
import CertStatusActionButton from './certStatusActionButton';
import CertStatusTable from './certStatusTable';
import HsLib from '@modules/common/HsLib';

function CertStatus() {
  // 삭제 시 상위 uuid 등록되어 있는 지 확인 -> 있으면 삭제 불가
  const { instance, source } = AuthInstance();

  certStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.vaCertStatus);
  const { size, page } = parameterData.parameters;

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('VACertStatusList', certStatusApi);

    if (gridInfo) {
      unstable_batchedUpdates(() => {
        responseGridInfo(gridInfo);
      });
    }

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

  const getCertStatusList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(certStatusApi.getCertStatusList, param);

      dispatch(setPageDataList({ pageDataList: content, totalElements }));

      setIsLoading(false);
    },
    [isMount, apiCall, dispatch],
  );

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      const result = await apiCall(
        certStatusApi.deleteCertStatusData,
        parameterData.deleteList.map((item) => item.id),
      );

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getCertStatusList({ ...parameterData.parameters.current, page: 0 });
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
      getCertStatusList(parameterData.parameters.current);
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
      <CertStatusSearchForm />
      <CertStatusActionButton
        onSearchButtonClick={getCertStatusList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      {isMount && <CertStatusTable getCertStatusList={getCertStatusList} />}
    </GridItem>
  );
}

export default CertStatus;
