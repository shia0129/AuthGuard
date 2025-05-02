import commonApi from '@api/common/commonApi';
import dbsyncApi from '@api/system/dbsyncApi';
import ErrorMessageModal from '@components/modal/system/dbsync/ErrorMessageModal';
import LoadingButton from '@components/modules/button/LoadingButton';
import ReactTable from '@components/modules/table/ReactTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import { RssFeed } from '@mui/icons-material';
import {
  Button,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { useIntl } from 'react-intl';
import SingleConfirm from '@components/modal/system/dbsync/SingleConfirm';

const tableHeaders = [
  'No',
  '처리 구분',
  '검증 결과',
  '신규 건수',
  '변경 건수',
  '삭제 건수',
  '연동 에러 메시지',
];

const BatchResultTable = ({ connectionSeq }) => {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  commonApi.axios = AuthInstance();
  const [deleteList, setDeleteList] = useState([]);

  //사용하지 않지만 ReactTable 변수로 넘겨주기 위해서 생성
  const [updateList, setUpdateList] = useState([]);
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // 에러 Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);
  // 싱글 실행 확인 Modal팝업 오픈여부 상태값
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  // intl 객체(다국어)
  const intl = useIntl();

  const [resultList, setResultList] = useState([]);
  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: dbsyncApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  //사용하지 않지만 ReactTable 변수로 넘겨주기 위해서 생성
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  const handleTestResult = async () => {
    setSingleModalOpen(false);

    if (connectionSeq == 0 || connectionSeq == '') {
      openModal({
        message: '접속 정보를 선택해주세요',
      });
      return;
    }
    setIsTesting(true);
    const result = await apiCall(dbsyncApi.postBatchTestResult, { connectionSeq: connectionSeq });
    if (result.status === 200) {
      setResultList(result.data);
      openModal({
        message: '테스트 결과를 가져왔습니다.',
        onConfirm: () => {},
      });

      setIsTesting(false);
    } else {
      openModal({
        message: '결과를 가져오는 과정에서 문제가 발생했습니다.',
        onConfirm: () => {},
      });

      setIsTesting(false);
    }
  };
  const rerenderErrorMessageCell = ({ row: { original } }) => {
    if (original.hasLink == 'N' || original.status === '미실행') {
      return original.status;
    }
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
          color: original.status === '실패' ? 'red' : 'blue',
          fontWeight: 'bold',
        }}
        onClick={() => {
          setErrorMessage(original.failureException);
          setModalOpen(true);
        }}
      >
        {original.status}
      </Link>
    );
  };
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'status':
          column.Cell = (props) => {
            return rerenderErrorMessageCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };
  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DbsyncBatchTest', dbsyncApi);

    if (gridInfo) {
      // 컬럼정보 재구성
      makeColumns(gridInfo.columns);
      setColumns(gridInfo.columns);
      setGridInfo((prev) => {
        return { ...prev, listInfo: gridInfo.listInfo };
      });
      setParameters({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
    }
  };
  const useEffect_0001 = useRef(false);

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

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2, mb: 2 }}>
        <LoadingButton
          variant="outlined"
          loadingPosition="start"
          loading={isTesting}
          startIcon={<RssFeed />}
          onClick={() => {
            setSingleModalOpen(true);
          }}
        >
          인사연동
        </LoadingButton>
      </Stack>
      <ReactTable
        columns={columns}
        data={resultList}
        setData={setResultList}
        checkList={deleteList}
        onChangeChecked={setDeleteList}
        setUpdateData={setUpdateList}
        gridInfo={gridInfo}
        setGridInfo={setGridInfo}
        setParameters={setParameters}
        parameters={unControlRef}
      />
      {modalOpen && (
        <ErrorMessageModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          messageList={[errorMessage]}
        />
      )}

      {singleModalOpen && (
        <SingleConfirm
          alertOpen={singleModalOpen}
          setModalOpen={setSingleModalOpen}
          handleTestResult={handleTestResult}
        />
      )}
    </>
  );
};

export default BatchResultTable;
