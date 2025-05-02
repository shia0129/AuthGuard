import { useEffect, useState, useCallback ,useRef} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import transBlockHistoryApi from '@api/status/cds/block/transBlockHistoryApi';
import codeApi from '@api/system/codeApi';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import BlockSearchForm from '@components/status/cds/block/blockSearchForm';
import BlockActionButton from '@components/status/cds/block/blockActionButton';
import BlockTable from '@components/status/cds/block/blockTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import {
  setParameters,
  setTransmissionBlockList,
  setColumns,
  setComboData,
} from '@modules/redux/reducers/transBlock';

function BlockHistory() {
  const { instance, source } = AuthInstance();
  transBlockHistoryApi.axios = instance;
  codeApi.axios = instance;

  const [apiCall] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.transBlock);

  const [gridInfo, setGridInfo] = useState({
    api: transBlockHistoryApi,
    parameters: parameterData.parameters,
    listInfo: {},
    total: 0,
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('InDtBlockHistory', transBlockHistoryApi);

    comboData('SYSTEM_GROUP_TYPE');
    comboData('SYSTEM_TYPE');
    comboData('BOUND_TYPE');
    comboData('PROTOCOL_TYPE');

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
      getTransmissionBlockList(parameterData.parameters.current);
    });
  };

  const comboData = async (codeType) => {
    const data = await HsLib.comboList(codeApi, codeType);

    dispatch(setComboData({ [codeType]: data }));
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns({ columns: p_gridInfo.columns }));

    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });

    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getTransmissionBlockList = useCallback(async (param) => {
    const { totalElements, content } = await apiCall(
      transBlockHistoryApi.getTransBlockHistoryList,
      param,
    );

    setGridInfo((prev) => {
      return { ...prev, total: totalElements };
    });

    dispatch(setTransmissionBlockList({ transmissionBlockList: content }));
  }, []);
  const useEffect_0001 = useRef(false);
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

  return (
    <GridItem spacing={2} container direction="column">
      <BlockSearchForm />
      <BlockActionButton onSearchButtonClick={getTransmissionBlockList} />
      <BlockTable gridInfo={gridInfo} setGridInfo={setGridInfo} />
    </GridItem>
  );
}

BlockHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BlockHistory;
