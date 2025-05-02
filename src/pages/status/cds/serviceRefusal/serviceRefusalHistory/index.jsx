import { useCallback, useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import serviceRefusalHistoryApi from '@api/status/cds/serviceRefusal/serviceRefusalHistoryApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import {
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/serviceRefusalHistory';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import ServiceRefusalSearchForm from '@components/status/cds/serviceRefusal/serviceRefusalSearchForm';
import ServiceRefusalActionButton from '@components/status/cds/serviceRefusal/serviceRefusalActionButton';
import ServiceRefusalTable from '@components/status/cds/serviceRefusal/serviceRefusalTable';
import HsFileHandler from '@modules/common/HsFileHandler';
import PdfDownloadModal from '@components/modal/pdf/pdfDownloadModal';

const pdfSearchInfo = (parameters, codeCacheList) => [
  {
    label: '시스템그룹',
    value: HsLib.findCodeDescFromCache(parameters['sysgrpId'], 'SYSTEM_GROUP_TYPE', codeCacheList),
  },
  {
    label: '시스템',
    value: HsLib.findCodeDescFromCache(parameters['systemId'], 'SYSTEM_TYPE', codeCacheList),
  },
  {
    label: '작업시간',
    value: `${parameters['workStartTime']} ~ ${parameters['workEndTime']}`,
  },
  { label: '출발지 IP', value: parameters['srcIp'] },
  { label: '출발지 Port', value: parameters['srcPort'] },
  { label: '목적지 IP', value: parameters['destIp'] },
  { label: '목적지 Port', value: parameters['destPort'] },
  {
    label: '프로토콜',
    value: HsLib.findCodeDescFromCache(parameters['protocol'], 'PROTOCOL_TYPE', codeCacheList),
  },
];

function ServiceRefusalHistory() {
  const { instance, source } = AuthInstance();
  serviceRefusalHistoryApi.axios = instance;

  const [open, setOpen] = useState(false);

  const [apiCall, openModal] = useApi();
  const dispatch = useDispatch();
  const { codeCacheList } = useSelector((state) => state.code);
  const parameterData = useSelector((state) => state.serviceRefusalHistory);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('InDtRefuseHis', serviceRefusalHistoryApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns({ columns: p_gridInfo.columns }));
    dispatch(setListInfo({ listInfo: p_gridInfo.listInfo }));
    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getServiceRefusalHistoryList = useCallback(async (param) => {
    const { totalElements, content } = await apiCall(
      serviceRefusalHistoryApi.getServiceRefusalHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  }, []);

  const getServiceRefusalHistoryListExcel = async () => {
    const result = await apiCall(
      serviceRefusalHistoryApi.getServiceRefusalHistoryListExcel,
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

  const getServiceRefusalHistoryPDFList = (param) =>
    apiCall(serviceRefusalHistoryApi.getServiceRefusalHistoryList, {
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
    getServiceRefusalHistoryList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <ServiceRefusalSearchForm />
      <ServiceRefusalActionButton
        onSearchButtonClick={getServiceRefusalHistoryList}
        onExcelButtonClick={getServiceRefusalHistoryListExcel}
        onPdfButtonClick={handlePdfDownloadModalOpen}
      />
      <ServiceRefusalTable />
      <PdfDownloadModal
        name="serviceRefusalHistory"
        open={open}
        setOpen={setOpen}
        searchInfo={pdfSearchInfo(parameterData.parameters.current, codeCacheList)}
        apiCallback={getServiceRefusalHistoryPDFList}
      />
    </GridItem>
  );
}

ServiceRefusalHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ServiceRefusalHistory;
