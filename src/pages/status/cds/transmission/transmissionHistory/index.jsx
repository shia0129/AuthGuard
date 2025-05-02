import { useCallback, useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import TransmissionSearchForm from '@components/status/cds/transmission/transmissionSearchForm';
import TransmissionActionButton from '@components/status/cds/transmission/transmissionActionButton';
import TransmissionTable from '@components/status/cds/transmission/transmissionTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import {
  setColumns,
  setListInfo,
  setParameters,
  setPageDataList,
} from '@modules/redux/reducers/transHistory';
import transmissionHistoryApi from '@api/status/cds/transmission/transmissionHistoryApi';
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
    value: `${parameters['workStart']} ~ ${parameters['workEnd']}`,
  },
  { label: '출발지 IP', value: parameters['srcIp'] },
  { label: '출발지 Port', value: parameters['srcPort'] },
  { label: '목적지 IP', value: parameters['destIp'] },
  { label: '목적지 Port', value: parameters['destPort'] },
  {
    label: '업무구분',
    value: HsLib.findCodeDescFromCache(parameters['protocol'], 'PROTOCOL_TYPE', codeCacheList),
  },
];

function TransmissionHistory() {
  const { instance, source } = AuthInstance();
  transmissionHistoryApi.axios = instance;

  const [open, setOpen] = useState(false);

  const [apiCall, openModal] = useApi();
  const dispatch = useDispatch();
  const { codeCacheList } = useSelector((state) => state.code);
  const parameterData = useSelector((state) => state.transHistory);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('InDtTransHistory', transmissionHistoryApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns({ columns: p_gridInfo.columns }));
    dispatch(setListInfo({ listInfo: p_gridInfo.listInfo }));
    dispatch(setParameters({ size: Number(p_gridInfo.listInfo.size) }));
  };

  const getTransmissionHistoryList = useCallback(async (param) => {
    const { totalElements, content } = await apiCall(
      transmissionHistoryApi.getTransmissionHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  }, []);

  const getTransmissionHistoryListExcel = async () => {
    const result = await apiCall(
      transmissionHistoryApi.getTransmissionHistoryListExcel,
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

  const handlePdfDownloadModalOpen = () => {
    setOpen(true);
  };

  const getTransmissionHistoryPDFList = (param) =>
    apiCall(transmissionHistoryApi.getTransmissionHistoryList, {
      ...parameterData.parameters.current,
      ...param,
    });
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
    getTransmissionHistoryList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <TransmissionSearchForm />
      <TransmissionActionButton
        onSearchButtonClick={getTransmissionHistoryList}
        onExcelButtonClick={getTransmissionHistoryListExcel}
        onPdfButtonClick={handlePdfDownloadModalOpen}
      />
      <TransmissionTable />
      <PdfDownloadModal
        name="transHistory"
        open={open}
        setOpen={setOpen}
        searchInfo={pdfSearchInfo(parameterData.parameters.current, codeCacheList)}
        apiCallback={getTransmissionHistoryPDFList}
      />
    </GridItem>
  );
}

TransmissionHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default TransmissionHistory;
