// libraries
import { useState, useEffect,useRef } from 'react';
import { Stack, IconButton } from '@mui/material';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// components
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import Transitions from '@components/@extended/Transitions';
// functions
import statisticsApi from '@api/statistics/transmission/data/statisticsApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';

function PolicyDay() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  statisticsApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 조건검색 작업시간 시작일, 종료일 기본값
  let today = HsLib.getTodayDate();
  let monthAgo = HsLib.getAfterDate('1M', today);

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    workStartDate: today,
    workEndDate: monthAgo,
    systemGroupSeq: '',
    systemSeq: '',
    serviceDescription: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 일별 목록
  const [policyDayList, setPolicyDayList] = useState([
    {
      systemSeq: '시스템',
      destinationIp: '-',
      serviceDescription: '-',
      statisticalItems: '-',
      date1: '-',
      date2: '-',
      date3: '-',
      date4: '-',
      date5: '-',
      date6: '-',
      date7: '-',
      date8: '-',
    },
  ]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: statisticsApi,
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

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('PolicyDayList', statisticsApi);

    setColumns(gridInfo.columns);

    setGridInfo((prev) => {
      return { ...prev, listInfo: gridInfo.listInfo };
    });

    setParameters({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });

    await getPolicyDayList({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
  };

  const getPolicyDayList = (parameters) => {
    // 일별 목록 조회 api 추가.
  };

  // 검색조건영역 확장/축소 버튼 클릭 이벤트
  const handleClick = () => {
    setSearchOpenFlag(!searchOpenFlag);
  };

  const handleGraphButtonClick = () => {
    console.log('그래프보기 버튼클릭');
  };

  const handleSelectButtonClick = () => {
    console.log('조회버튼클릭');
  };

  const handleExcelButtonClick = () => {
    console.log('엑셀버튼클릭');
  };

  const handlePdfButtonClick = () => {
    console.log('PDF버튼클릭');
  };

  return (
    <GridItem spacing={2} container direction="column">
      <SearchInput>
        <GridItem
          container
          divideColumn={4.5}
          spacing={2}
          sx={{
            pr: 10,
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '170px', minWidth: '170px' },
          }}
        >
          <Stack colSpan={1.5} direction="row" alignItems="center">
            <LabelInput
              type="date1"
              label="작업시간"
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
          <LabelInput type="select" label="시스템그룹" name="systemGroupSeq" />

          <LabelInput
            type="select"
            label="시스템"
            name="systemSeq"
            //   list={systemSeq}
          />
          <LabelInput type="select" label="서비스 설명" name="serviceDescription" />
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

        <Transitions type="collapse" in={searchOpenFlag}>
          <GridItem
            container
            divideColumn={1}
            spacing={2}
            sx={{
              pr: 10,
              pt: 2,
            }}
          >
            <LabelInput
              type="checkbox"
              label="통계항목"
              //   onChange={handleCheckBoxChange}
              list={[
                { label: '전체', value: 'All' },
                { label: '접속요청', value: 'connectionRequest' },
                { label: '접속성공', value: 'connectionSuccess' },
                { label: '접속실패', value: 'connectionFail' },
                { label: '접속종료', value: 'connectionEnd' },
                { label: '접속유지', value: 'connectionStay' },
                { label: '서비스된연결수', value: 'connectionCnt' },
                { label: '송신량(KByte)', value: 'transmit' },
                { label: '수신량(KByte)', value: 'receive' },
              ]}
              labelSx={{ maxWidth: '130px', minWidth: '130px' }}
            />
          </GridItem>
        </Transitions>
      </SearchInput>

      <GridItem item directionHorizon="end">
        <ButtonSet
          type="search"
          options={[
            {
              label: '그래프보기',
              callBack: handleGraphButtonClick,
              variant: 'outlined',
            },
            {
              label: '조회',
              callBack: handleSelectButtonClick,
              variant: 'outlined',
              color: 'secondary',
            },
            {
              label: '엑셀',
              callBack: handleExcelButtonClick,
              variant: 'outlined',
            },
            {
              label: 'PDF',
              variant: 'outlined',
              color: 'secondary',
              callBack: handlePdfButtonClick,
            },
          ]}
        />
      </GridItem>

      <GridItem item>
        <ReactTable
          listFuncName="getPolicyDayList"
          columns={columns}
          data={policyDayList}
          setData={setPolicyDayList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

export default PolicyDay;
