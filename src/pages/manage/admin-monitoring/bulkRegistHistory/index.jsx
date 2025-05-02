// libraries
import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import BulkRegistSearchForm from '@components/manage/admin-monitoring/bulkRegistHis/bulkRegistHisSearchForm';
import BulkRegistActionButton from '@components/manage/admin-monitoring/bulkRegistHis/bulkRegistHisActionButton';
import BulkRegistTable from '@components/manage/admin-monitoring/bulkRegistHis/bulkRegistTable';

// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import bulkRegistApi from '@api/manage/admin-monitoring/bulkRegistApi';
import { setColumns, setListInfo, setParameters } from '@modules/redux/reducers/bulkRegistHis';

function BulkRegistHistory() {
  const { instance, source } = AuthInstance();

  bulkRegistApi.axios = instance;

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.bulkRegistHis);
  const { size, page } = parameterData.parameters.current;

  const [apiCall, openModal] = useApi();

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('BulkRegistHis', bulkRegistApi);

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

  const getBulkRegistHistoryList = (parameters) => {
    // TODO: 일괄 등록 이력 조회 API 연결.
  };

  const handleExcelButtonClick = () => {
    // TODO: Excel 다운로드 API 연결.
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
    return () => source.cancel();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getBulkRegistHistoryList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <BulkRegistSearchForm />
      <BulkRegistActionButton
        onSearchButtonClick={getBulkRegistHistoryList}
        onExcelButtonClick={handleExcelButtonClick}
      />
      <BulkRegistTable />
    </GridItem>
  );
}

BulkRegistHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BulkRegistHistory;
