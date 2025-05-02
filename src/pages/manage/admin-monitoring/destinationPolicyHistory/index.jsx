// libraries
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import DestinationPolicyHisTable from '@components/manage/admin-monitoring/destinationPolicyHis/destinationPolicyHisTable';
import DestinationPolicyHisSearchForm from '@components/manage/admin-monitoring/destinationPolicyHis/destinationPolicyHisSearchForm';
import DestinationPolicyHisActionButton from '@components/manage/admin-monitoring/destinationPolicyHis/destinationPolicyHisActionButton';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/destinationPolicyHis';
import destinationPolicyHisApi from '@api/manage/admin-monitoring/destinationPolicyHisApi';
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
  { label: '목적지 IP', value: parameters['destIp'] },
  { label: '목적지 Port', value: parameters['destPort'] },

  {
    label: '목적지 구분',
    value: HsLib.findCodeDescFromCache(
      parameters['destType'],
      'DESTINATION_HOST_TYPE',
      codeCacheList,
    ),
  },
  {
    label: '프로토콜 설명',
    value: parameters['svcDesc'],
  },
];

function DestinationPolicyHistory() {
  const { instance, source } = AuthInstance();

  destinationPolicyHisApi.axios = instance;

  const [open, setOpen] = useState(false);

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();
  const { codeCacheList } = useSelector((state) => state.code);

  const parameterData = useSelector((state) => state.destinationPolicyHis);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DstntnPlcyChange', destinationPolicyHisApi);

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

  const getDestinationPolicyHistoryList = async (param) => {
    const { totalElements, content } = await apiCall(
      destinationPolicyHisApi.getDestinationPolicyHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleExcelButtonClick = async () => {
    const result = await apiCall(
      destinationPolicyHisApi.getDestinationPolicyHistoryExcelList,
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

  const getDestiantionPolicyHistoryPDFList = (param) =>
    apiCall(destinationPolicyHisApi.getDestinationPolicyHistoryList, {
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
    getDestinationPolicyHistoryList(parameterData.parameters.current);
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
      <DestinationPolicyHisSearchForm />
      <DestinationPolicyHisActionButton
        onSearchButtonClick={getDestinationPolicyHistoryList}
        onExcelButtonClick={handleExcelButtonClick}
        onPdfButtonClick={handlePdfDownloadModalOpen}
      />
      <DestinationPolicyHisTable />
      <PdfDownloadModal
        name="destinationPolicyHis"
        open={open}
        setOpen={setOpen}
        searchInfo={pdfSearchInfo(parameterData.parameters.current, codeCacheList)}
        apiCallback={getDestiantionPolicyHistoryPDFList}
      />
    </GridItem>
  );
}

DestinationPolicyHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DestinationPolicyHistory;
