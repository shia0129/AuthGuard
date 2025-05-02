import { useEffect, useRef, useState, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';

import policyDetailStatusApi from '@api/hss/sslva/policy/policyDetailStatusApi';
import protocolStatusApi from '@api/hss/sslva/policy/protocolStatusApi';
import certStatusApi from '@api/hss/sslva/policy/certStatusApi';

import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setParameters,
  setProtocolTypeList,
  setCertNameList,
  resetState,
} from '@modules/redux/reducers/hss/sslva/policyDetailStatus';

import PolicyDetailStatusSearchForm from './policyDetailStatusSearchForm';
import PolicyDetailStatusActionButton from './policyDetailStatusActionButton';
import PolicyDetailStatusTable from './policyDetailStatusTable';
import HsLib from '@modules/common/HsLib';
import Loader from '@components/mantis/Loader';

function PolicyDetailStatus() {
  const { instance, source } = AuthInstance();

  policyDetailStatusApi.axios = instance;
  protocolStatusApi.axios = instance;
  certStatusApi.axios = instance;

  const [apiCall, openModal] = useApi();
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.policyDetailStatus);
  const { size, page } = parameterData.parameters.current;
  const [protocolList, setProtocolList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isMount, setIsMount] = useState(false);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);

  const init = async () => {
    const [gridInfo, protocols, protocolTypes, certNames] = await Promise.all([
      HsLib.getGridInfo('PolicyDetailStatusList', policyDetailStatusApi),
      apiCall(protocolStatusApi.getProtocolStatusList, { contentOnly: true }),
      apiCall(protocolStatusApi.getProtocolTypeList),
      apiCall(certStatusApi.getCertNameList),
    ]);

    const formattedTypes = Array.isArray(protocolTypes)
      ? protocolTypes.map(({ id, name }) => ({ value: id, label: name.toUpperCase() }))
      : [];

    const formattedCerts = Array.isArray(certNames)
      ? certNames.map(({ id, name }) => ({ value: id, label: name }))
      : [];

    unstable_batchedUpdates(() => {
      dispatch(setColumns(gridInfo.columns));
      dispatch(setListInfo(gridInfo.listInfo));
      dispatch(setParameters({ size: Number(gridInfo.listInfo.size) }));

      if (Array.isArray(protocols)) {
        setProtocolList(protocols);
      }

      if (Array.isArray(formattedTypes) && formattedTypes.length) {
        dispatch(setProtocolTypeList(formattedTypes));
      }

      if (Array.isArray(formattedCerts) && formattedCerts.length) {
        dispatch(setCertNameList(formattedCerts));
      }
    });

    setIsMount(true);
  };

  const fetchPolicyList = useCallback(
    async (param = {}) => {
      if (!isMount) return;
      if (!isLoading) {
        setIsLoading(true);
      }

      const { totalElements, content } = await apiCall(
        policyDetailStatusApi.getPolicyDetailStatusList,
        param,
      );

      dispatch(setPageDataList({ pageDataList: content, totalElements }));

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
      policyDetailStatusApi.deletePolicyDetailStatusData,
      deleteItems.map((item) => item.id),
    );

    setIsLoading(false);

    if (result) {
      openModal({
        message: result,
        onConfirm: () => {
          dispatch(setDeleteList([]));
          dispatch(setParameters({ page: 0 }));
          fetchPolicyList({ ...parameterData.parameters.current, page: 0 });
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
      fetchPolicyList(parameterData.parameters.current);
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
    return () => source.cancel();
  }, []);

  return (
    <GridItem spacing={2} container direction="column">
      {isLoading && <Loader isGuard />}
      <PolicyDetailStatusSearchForm />
      <PolicyDetailStatusActionButton
        onSearchButtonClick={fetchPolicyList}
        onDeleteButtonClick={handleDelete}
        protocolList={protocolList}
      />
      {isMount && (
        <PolicyDetailStatusTable
          getPolicyDetailStatusList={fetchPolicyList}
          protocolList={protocolList}
        />
      )}
    </GridItem>
  );
}

export default PolicyDetailStatus;
