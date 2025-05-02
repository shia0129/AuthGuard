// libraries
import { useState, useEffect,useRef } from 'react';
import { Stack } from '@mui/material';
// components
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
// functions
import statisticsApi from '@api/statistics/transmission/data/statisticsApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';

function ProtocolMonth() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  statisticsApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 조건검색 작업시간 기본값
  let today = HsLib.getTodayDate();
  let monthAgo = HsLib.getAfterDate('1M', today);

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    workStartDate: today,
    workEndDate: monthAgo,
    systemGroupSeq: '',
    systemSeq: '',
    statisticalItems: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 월별 목록
  // 리스트 컬럼관리 컬럼명 추가필요. 예시라 10개만넣음
  const [protocolMonthList, setProtocolMonthList] = useState([
    {
      systemSeq: '시스템',
      statisticalItems: '-',
      date1: '-',
      date2: '-',
      date3: '-',
      date4: '-',
      date5: '-',
      date6: '-',
      date7: '-',
    },
  ]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: statisticsApi,
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

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('ProtocolMonth', statisticsApi);

    setColumns(gridInfo.columns);

    setGridInfo((prev) => {
      return { ...prev, listInfo: gridInfo.listInfo };
    });

    setParameters({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });

    await getProtocolMonthList({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
  };

  const getProtocolMonthList = (parameters) => {
    // 월별 목록 조회 api 추가.
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
          divideColumn={5}
          spacing={2}
          sx={{
            pr: 5,
            '& .text': { maxWidth: '100px', minWidth: '100px' },
            '.inputBox': { maxWidth: '160px', minWidth: '160px' },
          }}
        >
          <Stack colSpan={1.5} direction="row" alignItems="center">
            <LabelInput
              type="date1"
              label="작업시간"
              name="workStartDate"
              views={['year', 'month']}
              inputFormat="YYYY-MM"
              sx={{ maxWidth: '140px', minWidth: '140px' }}
              value={parameters.workStartDate}
              onChange={changeParameters}
            />
            &nbsp;~&nbsp;
            <LabelInput
              type="date1"
              name="workEndDate"
              views={['year', 'month']}
              inputFormat="YYYY-MM"
              sx={{ maxWidth: '140px', minWidth: '140px' }}
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
          <LabelInput
            type="checkbox"
            label="통계항목"
            colSpan={1.5}
            //   onChange={handleCheckBoxChange}
            list={[
              { label: '전체', value: 'All' },
              { label: 'ICMP', value: 'icmp' },
              { label: 'TCP', value: 'tcp' },
              { label: 'UDP', value: 'udp' },
            ]}
            // labelSx={{ maxWidth: '130px', minWidth: '130px' }}
          />
        </GridItem>
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
          listFuncName="getProtocolMonthList"
          columns={columns}
          data={protocolMonthList}
          setData={setProtocolMonthList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

export default ProtocolMonth;
