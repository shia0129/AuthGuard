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

//매핑정보 검증결과 정렬순서
const categorySortOrder = ['부서 테이블 조회 및 저장', '사용자 테이블 조회 및 저장'];

/**
 * MappingResultTable 정의
 *
 * 매핑정보 결과 테이블
 *
 * @param {String} connectionSeq 선택된 연결정보 seq
 *
 */
const MappingResultTable = ({ connectionSeq }) => {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  const [deleteList, setDeleteList] = useState([]);

  //사용하지 않지만 ReactTable 변수로 넘겨주기 위해서 생성
  const [updateList, setUpdateList] = useState([]);
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);
  //Modal에 넘겨줄 에러메시지 상태값
  const [messageList, setMessageList] = useState([]);
  //검증 진행여부 상태값
  const [isTesting, setIsTesting] = useState(false);
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

  //필수 매핑정보인 user_id, ori_p_key의 갯수를 반환
  //user_id, ori_p_key가 지정되지 않으면 검증을 진행하지 않기위함.
  const getMappingDataCount = async (mappingTableTo) => {
    const result = await apiCall(dbsyncApi.getMappingData, {
      connectionSeq,
      mappingTableTo,
    });
    if (result.status == 200) {
      return result.data.filter(
        (e) => e.mappingColumnTo == (mappingTableTo == 'tbl_user_info' ? 'user_id' : 'ori_p_key'),
      ).length;
    } else {
      return 0;
    }
  };

  //매핑정보 검증 결과 조회
  const getMappingTestResult = async () => {
    setIsTesting(true);

    //사용자,부서 필수컬럼이 지정되지 않은 경우는 검증 진행X
    const userMappingCount = await getMappingDataCount('tbl_user_info');
    const deptMappingCount = await getMappingDataCount('tbl_dept_info');

    if (userMappingCount == 0 || deptMappingCount == 0) {
      openModal({
        message: '사용자,부서의 필수컬럼이 지정되지 않았습니다. ex) user_id, ori_p_key',
        onConfirm: () => {},
      });
      setIsTesting(false);
      return;
    }

    const result = await apiCall(dbsyncApi.getMappingTestResult, { connectionSeq: connectionSeq });
    if (result.status === 200) {
      //가져온 결과를 정렬후 저장
      setResultList(
        result.data
          .map((e) => {
            return {
              ...e,
              id: categorySortOrder.indexOf(e.category),
            };
          })
          .sort((a, b) => a.id - b.id),
      );
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

  //에러메시지 셀 렌더링 함수
  const rerenderMessageListCell = ({ row: { original } }) => {
    if (original.result === '성공' || original.result === '미실행') {
      return original.result;
    } else {
      return (
        <Link
          sx={{
            cursor: 'pointer',
            display: 'inline-block',
            height: 1,
            width: 1,
            color: 'red',
            fontWeight: 'bold',
          }}
          onClick={() => {
            setMessageList(original.messageList);
            setModalOpen(true);
          }}
        >
          {original.result}
        </Link>
      );
    }
  };

  //커스텀 셀을 위해 Cell을 재지정
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'result':
          column.Cell = (props) => {
            return rerenderMessageListCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };

  //최초 렌더링시 초기화 함수
  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DbsyncMapTest', dbsyncApi);

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
          onClick={getMappingTestResult}
        >
          매핑 검증
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
          messageList={messageList}
        />
      )}
    </>
  );
};

export default MappingResultTable;
