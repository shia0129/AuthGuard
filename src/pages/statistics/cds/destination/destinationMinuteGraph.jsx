// libraries
import { useState, useEffect,useRef} from 'react';
// components
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
// functions
import statisticsApi from '@api/statistics/transmission/data/statisticsApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';

function DestinationMinuteGraph() {
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
    // 그래프 parameter에 따라 조회되게
  };

  const handleSelectButtonClick = () => {
    console.log('조회버튼클릭');
  };

  return (
    <GridItem spacing={2} container direction="column">
      <SearchInput>
        <GridItem
          container
          divideColumn={4}
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
        </GridItem>
      </SearchInput>

      <GridItem item directionHorizon="end">
        <ButtonSet
          type="search"
          options={[
            {
              label: '조회',
              callBack: handleSelectButtonClick,
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>

      <GridItem item>
        <div>그래프위치</div>
      </GridItem>
    </GridItem>
  );
}

export default DestinationMinuteGraph;
