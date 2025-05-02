import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import PolicyStatusSearchForm from '@components/cds/cdsPolicyManage/cdsPolicyStatus/policyStatusSearchForm';
import PolicyStatusActionButton from '@components/cds/cdsPolicyManage/cdsPolicyStatus/policyStatusActionButton';
import PolicyStatusTable from '@components/cds/cdsPolicyManage/cdsPolicyStatus/policyStatusTable';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import {
  setParameters,
  setColumns,
  setListInfo,
  setPageDataList,
} from '@modules/redux/reducers/policyStatus';
import policyStatusApi from '@api/cds/cdsPolicyManage/cdsPolicyStatus/policyStatusApi';
import codeApi from '@api/system/codeApi';
import useApi from '@modules/hooks/useApi';
import HsFileHandler from '@modules/common/HsFileHandler';

function PolicyStatusList() {
  const { instance, source } = AuthInstance();
  policyStatusApi.axios = instance;
  codeApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.policyStatus);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('PolicytStatList', policyStatusApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
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

  const getPolicyStatusList = async (param) => {
    const { totalElements, content } = await apiCall(policyStatusApi.getPolicyStatusList, param);
    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleExcelButtonClick = async () => {
    const result = await apiCall(
      policyStatusApi.getPolicyStatusExcelList,
      parameterData.parameters.current,
    );

    const { isSuccess, message } = HsFileHandler.saveAsExcel(result);

    if (!isSuccess) {
      openModal({
        message,
        type: 'error',
      });
    }
  };
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();
    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getPolicyStatusList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <PolicyStatusSearchForm />
      <PolicyStatusActionButton
        onSearchButtonClick={getPolicyStatusList}
        onExcelButtonClick={handleExcelButtonClick}
      />
      <PolicyStatusTable />
    </GridItem>
  );
}

PolicyStatusList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyStatusList;
