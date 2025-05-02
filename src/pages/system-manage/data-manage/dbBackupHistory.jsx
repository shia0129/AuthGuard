// libraries
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Replay } from '@mui/icons-material';
import { Button, IconButton, Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Transitions from '@components/@extended/Transitions';
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
// functions
import dbBackupHistoryApi from '@api/system-manage/data-manage/dbBackupHistoryApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';

function DbBackupHistory() {
  // Axios 인스턴스(Http통신)
  const { instance, source } = AuthInstance();
  dbBackupHistoryApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // 조건검색 요청일시 시작일, 종료일 기본값
  let today = HsLib.getTodayDate();
  let monthAgo = HsLib.getAfterDate('1M', today);
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    workStartDate: today,
    workEndDate: monthAgo,
    workName: '',
    workResult: '',
    workAccess: '',
    tblName: '',
  });
  // DB 백업 및 삭제 이력 목록 상태값
  const [dbBackupHistoryList, setDbBackupHistoryList] = useState([]);
  // 컬럼 정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블 정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: dbBackupHistoryApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 조회영역 확장여부 상태값
  const [searchOpenFlag, setSearchOpenFlag] = useState(false);
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
    const gridInfo = await HsLib.getGridInfo('DbBackupHistory', dbBackupHistoryApi);
    // DB 백업 및 삭제 이력 목록 요청
    const dbBackupHistoryList = await apiCall(dbBackupHistoryApi.getDbBackupHistoryList, {
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
    // 일괄 변경 처리
    unstable_batchedUpdates(() => {
      // 테이블, 컬럼정보 응답처리
      responseGridInfo(gridInfo);
      // DB 백업 및 삭제 이력 목록 응답처리
      // responseDbBackupHistoryList(dbBackupHistoryList);
      // 임시 데이터
      setDbBackupHistoryList([
        {
          workDate: '2024-05-08 09:08:45',
          workName: '작업명',
          backReq: '복구요청',
          workResult: '성공',
          workAccess: 'Backup',
          tblName: 'tbl_user_info',
          workIndex: '8',
          workTime: '1',
          backupPath: '/backup',
        },
      ]);
    });
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    // 컬럼정보 재구성
    makeColumns(p_gridInfo.columns);
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
  // DB 백업 및 삭제 이력 목록 응답처리
  const responseDbBackupHistoryList = (p_dbBackupHistoryList) => {
    if (p_dbBackupHistoryList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_dbBackupHistoryList.data.totalElements };
      });
      // DB 백업 및 삭제 이력 목록 상태값 변경
      setDbBackupHistoryList(p_dbBackupHistoryList.data.content);
    }
  };
  // DB 백업 및 삭제 이력 목록만 출력
  const getDbBackupHistoryList = async (parameters) => {
    const result = await apiCall(dbBackupHistoryApi.getDbBackupHistoryList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (!parameters) {
          resetParameters();
        }
        // DB 백업 및 삭제 이력 목록 응답처리
        responseDbBackupHistoryList(result);
      });
    }
  };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'backReq':
          column = {
            ...column,
            buttonProps: {
              contents: '복구요청',
              sx: {
                width: '10px',
                border: '1px solid #5674b9',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: '#5674b9',
                },
                mt: '1px',
              },

              variant: 'outlined',
            },
            buttonCallback: (args) => {
              openModal({
                message: `복구요청을 하시겠습니까?`,
                onConfirm: handleBackupRequest,
              });
            },
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };
  // 복구요청 처리 함수
  const handleBackupRequest = () => {
    console.log('복구요청');
  };
  // 검색조건영역 확장/축소 버튼 클릭 이벤트
  const handleClick = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };
  return (
    <GridItem spacing={2} container direction="column">
      <SearchInput /*onSearch={() => getDbBackupHistoryList(parameters)}*/>
        <GridItem
          container
          divideColumn={4}
          spacing={2}
          sx={{
            pr: 5,
            '& .text': { maxWidth: '150px', minWidth: '150px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <Stack colSpan={1.5} direction="row" alignItems="center">
            <LabelInput
              type="date1"
              label="작업일시"
              name="workStartDate"
              sx={{ maxWidth: '150px', minWidth: '150px' }}
              value={parameters.workStartDate}
              onChange={changeParameters}
            />
            &nbsp;~&nbsp;
            <LabelInput
              type="date1"
              name="workEndDate"
              sx={{ maxWidth: '150px', minWidth: '150px' }}
              value={parameters.workEndDate}
              onChange={changeParameters}
            />
          </Stack>
          <LabelInput
            sx={{ maxWidth: 170 }}
            label="작업명"
            name="workName"
            value={parameters.workName}
            onChange={changeParameters}
          />
          <LabelInput
            type="select"
            label="작업결과"
            name="workResult"
            value={parameters.workResult}
            onChange={changeParameters}
            //   list={workResult}
          />
        </GridItem>

        <IconButton
          aria-label="delete"
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: '15px',
            '&:hover': {
              bgcolor: 'transparent',
            },
          }}
          onClick={handleClick}
        >
          {searchOpenFlag ? <UpOutlined fontSize="small" /> : <DownOutlined fontSize="small" />}
        </IconButton>

        {/* 검색조건 펼치면 보여지는 내용 */}
        <Transitions type="collapse" in={searchOpenFlag}>
          <GridItem
            divideColumn={4}
            spacing={2}
            sx={{
              pr: 5,
              pt: 2,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              colSpan={1.5}
              type="select"
              label="작업구분"
              name="workAccess"
              value={parameters.workAccess}
              onChange={changeParameters}
              //   list={workAccess}
            />
            <LabelInput
              sx={{ maxWidth: 170 }}
              label="테이블명"
              name="tblName"
              value={parameters.tblName}
              onChange={changeParameters}
            />
          </GridItem>
        </Transitions>
      </SearchInput>

      <GridItem item directionHorizon="end">
        <Stack childtype="dom" direction="row" justifyContent="flex-end">
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={() => {
              // getDbBackupHistoryList();
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
                // callBack: () => getDbBackupHistoryList(parameters),
              },
            ]}
          />
        </Stack>
      </GridItem>
      <GridItem item>
        <ReactTable
          listFuncName="getDbBackupHistoryList"
          columns={columns}
          data={dbBackupHistoryList}
          setData={setDbBackupHistoryList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

DbBackupHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DbBackupHistory;
