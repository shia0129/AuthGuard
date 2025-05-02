import dbsyncApi from '@api/system/dbsyncApi';
import ErrorMessageModal from '@components/modal/system/dbsync/ErrorMessageModal';
import LoadingButton from '@components/modules/button/LoadingButton';
import ReactTable from '@components/modules/table/ReactTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import { RssFeed } from '@mui/icons-material';
import { Link, Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { useIntl } from 'react-intl';

/**
 * ApproveLineResultTable 정의
 *
 * 결재선정책 검증결과 테이블
 *
 * @param {String} connectionSeq 선택된 연결방식 seq
 *
 *
 */
const ApproveLineResultTable = ({ connectionSeq }) => {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  const [deleteList, setDeleteList] = useState([]);

  //사용하지 않지만 ReactTable 변수로 넘겨주기 위해서 생성
  const [updateList, setUpdateList] = useState([]);
  //에러메시지 모달에 보내주기 위한 상태값
  const [errorMessage, setErrorMessage] = useState([]);
  //검증 진행 여부 상태값
  const [isTesting, setIsTesting] = useState(false);
  // Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();

  //검증결과 상태값
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

  //결재선정책 갯수 조회
  const getApprLinePolicyCount = async () => {
    //결재선정책 조회
    const result = await apiCall(dbsyncApi.getApprLinePolicy, {
      connectionSeq,
    });

    if (result.status === 200) {
      return result.data.length;
    } else {
      return 0;
    }
  };

  //결재선정책 검증결과 조회
  const getApprLineTestResult = async () => {
    setIsTesting(true);

    //결재선정책을 생성하지 않은 경우 검증 진행X
    const apprLinePolicyCount = await getApprLinePolicyCount();

    if (apprLinePolicyCount <= 0) {
      openModal({
        message: '결재선정책을 생성해주세요.',
        onConfirm: () => {},
      });
      setIsTesting(false);
      return;
    }

    const result = await apiCall(dbsyncApi.getApprLineTestResult, { connectionSeq: connectionSeq });
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

  //에러 메시지 cell 렌더링 함수
  const rerenderErrorMessageCell = ({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
          fontWeight: 'bold',
        }}
        onClick={() => {
          setErrorMessage(original.errorMessage);
          setModalOpen(true);
        }}
      >
        {original.errorMessage}
      </Link>
    );
  };

  //커스텀 cell의 Cell을 지정
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'errorMessage':
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

  //첫 렌더링시 초기화 함수
  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DbsyncLineTest', dbsyncApi);

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
          onClick={getApprLineTestResult}
        >
          결재선 정책 검증
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
    </>
  );
};

export default ApproveLineResultTable;
