// libraries
import { useState, useEffect,useRef } from 'react';
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

function ProtocolMinute() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  statisticsApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 조건검색 작업시간 기본값
  let today = HsLib.getTodayDate();

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    workDate: today,
    systemGroupSeq: '',
    systemSeq: '',
    statisticalItems: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 분별 목록
  // 리스트 컬럼관리 컬럼명 추가필요. 예시라 10개만넣음
  const [protocolMinList, setProtocolMinList] = useState([
    {
      systemSeq: '시스템',
      statisticalItems: '-',
      min1: '-',
      min2: '-',
      min3: '-',
      min4: '-',
      min5: '-',
      min6: '-',
      min7: '-',
      min8: '-',
      min9: '-',
      min10: '-',
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
    const gridInfo = await HsLib.getGridInfo('ProtocolMinList', statisticsApi);

    setColumns(gridInfo.columns);

    setGridInfo((prev) => {
      return { ...prev, listInfo: gridInfo.listInfo };
    });

    setParameters({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });

    await getProtocolMinList({
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
  };

  const getProtocolMinList = (parameters) => {
    // 분별 목록 조회 api 추가.
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
            '& .text': { maxWidth: '130px', minWidth: '130px' },
            '.inputBox': { maxWidth: '170px', minWidth: '170px' },
          }}
        >
          <LabelInput
            type="dateTime"
            label="작업시간"
            name="workDate"
            views={['year', 'month', 'day', 'hours']}
            inputFormat="YYYY-MM-DD HH"
            sx={{ maxWidth: '170px', minWidth: '170px' }}
            value={parameters.workDate}
            onChange={changeParameters}
          />
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
            colSpan={2}
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
          listFuncName="getPolicyDayList"
          columns={columns}
          data={protocolMinList}
          setData={setProtocolMinList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

export default ProtocolMinute;
