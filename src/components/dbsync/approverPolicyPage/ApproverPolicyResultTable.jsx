import commonApi from '@api/common/commonApi';
import dbsyncApi from '@api/system/dbsyncApi';
import ReactTable from '@components/modules/table/ReactTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import { Button, Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { useIntl } from 'react-intl';

/**
 * ApproverPolicyResultTable 정의
 *
 * 결재자정책 검증결과 테이블(아직 결재자 검증 API가 완성되지않아 미완성)
 *
 * @param {String} connectionSeq 연결방식 seq
 *
 *
 */
const ApproverPolicyResultTable = ({ connectionSeq }) => {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;
  commonApi.axios = AuthInstance();
  const [deleteList, setDeleteList] = useState([]);

  //사용하지 않지만 ReactTable 변수로 넘겨주기 위해서 생성
  const [updateList, setUpdateList] = useState([]);
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
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
    const result = await apiCall(dbsyncApi.getApprTestResult);
    if (result.status === 200) {
      setResultList(result.data);
      openModal({
        message: '테스트 결과를 가져왔습니다.',
        onConfirm: () => {},
      });
    } else {
      openModal({
        message: '결과를 가져오는 과정에서 문제가 발생했습니다.',
        onConfirm: () => {},
      });
    }
  };
  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DbsyncApprTest', dbsyncApi);

    if (gridInfo) {
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
        <Button variant="contained" onClick={handleTestResult}>
          결재자 정책 검증
        </Button>
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
    </>
  );
};

export default ApproverPolicyResultTable;
