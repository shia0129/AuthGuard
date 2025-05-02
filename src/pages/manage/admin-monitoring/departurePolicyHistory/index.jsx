// libraries
import { useEffect, useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import DeparturePolicyHisSearchForm from '@components/manage/admin-monitoring/departurePolicyHis/departurePolicyHisSearchForm';
import DeparturePolicyHisActionButton from '@components/manage/admin-monitoring/departurePolicyHis/departurePolicyHisActionButton';
import DeparturePolicyHisTable from '@components/manage/admin-monitoring/departurePolicyHis/departurePolicyHisTable';

// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import departurePolicyHisApi from '@api/manage/admin-monitoring/departurePolicyHisApi';
import HsLib from '@modules/common/HsLib';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/departurePolicyHis';
import HsFileHandler from '@modules/common/HsFileHandler';
import PdfDownloadModal from '@components/modal/pdf/pdfDownloadModal';
import moment from 'moment';

const pdfSearchInfo = (parameters, codeCacheList) => [
  {
    label: '변경시간',
    value: `${moment(parameters['requestStartDate']).format('YYYY-MM-DD')}~${moment(
      parameters['requestEndDate'],
    ).format('YYYY-MM-DD')}`,
  },
  {
    label: '작업자',
    value: parameters['adminInfo'].name,
  },
  {
    label: '구분',
    value: HsLib.findCodeDescFromCache(
      parameters['controlFlag'],
      'POLICY_ACTION_STATUS',
      codeCacheList,
    ),
  },
  {
    label: '시스템 그룹',
    value: HsLib.findCodeDescFromCache(
      parameters['systemGroupId'],
      'SYSTEM_GROUP_TYPE',
      codeCacheList,
    ),
  },
  {
    label: '시스템',
    value: HsLib.findCodeDescFromCache(parameters['systemId'], 'SYSTEM_TYPE', codeCacheList),
  },
  {
    label: '서비스 구분',
    value: HsLib.findCodeDescFromCache(parameters['svcMod'], 'SERVICE_METHOD', codeCacheList),
  },
  { label: '출발지 IP', value: parameters['srcIp'] },
  { label: '목적지 IP', value: parameters['destIp'] },
  {
    label: '목적지 Port',
    value: parameters['destPort'],
  },
];

function DeparturePolicyHistory() {
  const { instance, source } = AuthInstance();

  departurePolicyHisApi.axios = instance;

  const [open, setOpen] = useState(false);

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();
  const { codeCacheList } = useSelector((state) => state.code);

  const parameterData = useSelector((state) => state.departurePolicyHis);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DepartPlcyChange', departurePolicyHisApi);

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

  const getDeparturePolicyHistoryList = async (param) => {
    const { totalElements, content } = await apiCall(
      departurePolicyHisApi.getDeparturePolicyHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleExcelButtonClick = async () => {
    const result = await apiCall(
      departurePolicyHisApi.getDeparturePolicyHistoryExcelList,
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

  const getDeparturePolicyHistoryPDFList = (param) =>
    apiCall(departurePolicyHisApi.getDeparturePolicyHistoryList, {
      ...parameterData.parameters.current,
      ...param,
    });

  const handlePdfDownloadModalOpen = () => {
    setOpen(true);
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
    getDeparturePolicyHistoryList(parameterData.parameters.current);
  }, [size, page]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    init();
    return () => source.cancel();
  }, []);

  return (
    <GridItem spacing={2} container direction="column">
      <DeparturePolicyHisSearchForm />
      <DeparturePolicyHisActionButton
        onSearchButtonClick={getDeparturePolicyHistoryList}
        onExcelButtonClick={handleExcelButtonClick}
        onPdfButtonClick={handlePdfDownloadModalOpen}
      />
      <DeparturePolicyHisTable />
      <PdfDownloadModal
        name="departurePolicyHis"
        open={open}
        setOpen={setOpen}
        searchInfo={pdfSearchInfo(parameterData.parameters.current, codeCacheList)}
        apiCallback={getDeparturePolicyHistoryPDFList}
      />
    </GridItem>
  );
}

DeparturePolicyHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DeparturePolicyHistory;
