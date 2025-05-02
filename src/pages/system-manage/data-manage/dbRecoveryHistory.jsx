// libraries
import { Replay } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
// functions
import dbRecoveryHistoryApi from '@api/system-manage/data-manage/dbRecoveryHistoryApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import usePopup from '@modules/hooks/usePopup';

function DbRecoveryHistory() {
  // Axios 인스턴스(Http통신)
  const { instance, source } = AuthInstance();
  dbRecoveryHistoryApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // 팝업 함수
  const handleOpenWindow = usePopup();
  // 조건검색 요청일시 시작일, 종료일 기본값
  let today = HsLib.getTodayDate();
  let monthAgo = HsLib.getAfterDate('1M', today);
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    workStartTime: today,
    workEndTime: monthAgo,
    workResult: '',
    workName: '',
    tblName: '',
    backupPath: '',
  });
  // DB 복구 이력 목록 상태값
  const [dbRecoveryHistoryList, setDbRecoveryHistoryList] = useState([]);
  // 컬럼 정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블 정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: dbRecoveryHistoryApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화 함수
    init();
    // Clean-up
    return () => source.cancel();
  }, []);
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보 요청
    const gridInfo = await HsLib.getGridInfo('DbRecoveryHis', dbRecoveryHistoryApi);
    // DB 복구 이력 목록 요청
    const dbRecoveryHistoryList = await apiCall(dbRecoveryHistoryApi.getDbRecoveryHistoryList, {
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      // 테이블, 컬럼정보 응답처리
      responseGridInfo(gridInfo);
      // DB 복구 이력 목록 응답처리
      // responseDbRecoveryHistory(dbRecoveryHistoryList);
      // 임시 데이터
      setDbRecoveryHistoryList([
        {
          workStartTime: '2024-04-30 13:37:50',
          workResult: '성공',
          workDate: '2024-04-30 13:37:50',
          workName: '-',
          tblName: '-',
          backupPath: '-',
        },
      ]);
    });
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    // 컬럼정보 상태값 변경
    setColumns(p_gridInfo.columns);
    // 테이블정보 상태값 변경
    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });
    // 검색조건 변경
    setParameters({
      ...parameters,
      sort: `${p_gridInfo.listInfo.sortColumn ?? ''},${p_gridInfo.listInfo.sortDirection ?? ''}`,
      size: p_gridInfo.listInfo.size,
    });
  };
  // DB 복구 이력 목록 응답처리
  const responseDbRecoveryHistory = (p_dbRecoveryHistoryList) => {
    if (p_dbRecoveryHistoryList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_dbRecoveryHistoryList.data.totalElements };
      });
      // DB 복구 이력 목록 상태값 변경
      setDbRecoveryHistoryList(p_dbRecoveryHistoryList.data.content);
    }
  };
  // DB 복구 이력 목록만 출력
  const getDbRecoveryHistoryList = async (parameters) => {
    const result = await apiCall(dbRecoveryHistoryApi.getDbRecoveryHistoryList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (!parameters) {
          resetParameters();
        }
        // DB 복구 이력 목록 응답처리
        responseDbRecoveryHistory(result);
      });
    }
  };
  return (
    <GridItem spacing={2} container direction="column">
      <SearchInput /*onSearch={() => getDbRecoveryHistoryList(parameters)}*/>
        <GridItem
          container
          divideColumn={5}
          spacing={2}
          sx={{
            pr: 5,
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '190px', minWidth: '190px' },
          }}
        >
          <Stack colSpan={1.5} direction="row" alignItems="center">
            <LabelInput
              type="date1"
              label="복구 요청시간"
              name="workStartTime"
              sx={{ maxWidth: '140px', minWidth: '140px' }}
              value={parameters.workStartTime}
              onChange={changeParameters}
            />
            &nbsp;~&nbsp;
            <LabelInput
              type="date1"
              name="workEndTime"
              sx={{ maxWidth: '140px', minWidth: '140px' }}
              value={parameters.workEndTime}
              onChange={changeParameters}
            />
          </Stack>
          <LabelInput
            type="select"
            label="복구 작업결과"
            name="systemGroupSeq"
            value={parameters.systemGroupSeq}
            onChange={changeParameters}
            //   list={systemGroupSeq}
          />
          <LabelInput
            sx={{ maxWidth: 170 }}
            label="백업 작업명"
            name="workName"
            value={parameters.workName}
            onChange={changeParameters}
          />
          <LabelInput
            sx={{ maxWidth: 170 }}
            label="테이블명"
            name="tblName"
            value={parameters.tblName}
            onChange={changeParameters}
          />
        </GridItem>
      </SearchInput>
      <GridItem item directionHorizon="end">
        <Stack childtype="dom" direction="row" justifyContent="flex-end">
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={() => {
              // getDbRecoveryHistoryList();
            }}
            sx={{ mr: '10px' }}
          >
            <Replay />
          </Button>
          <ButtonSet
            type="search"
            options={[
              { label: '초기화', callBack: resetParameters },
              {
                label: '검색',
                // callBack: () => getDbRecoveryHistoryList(parameters),
              },
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem item>
        <ReactTable
          listFuncName="getDbRecoveryHistoryList"
          columns={columns}
          data={dbRecoveryHistoryList}
          setData={setDbRecoveryHistoryList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

DbRecoveryHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DbRecoveryHistory;
