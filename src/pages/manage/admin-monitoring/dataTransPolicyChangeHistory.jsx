// libraries
import { useEffect, useState,useRef } from 'react';
import { Stack } from '@mui/material';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import ReactTable from '@components/modules/table/ReactTable';

// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import HsLib from '@modules/common/HsLib';
import adminMonitoringApi from '@api/manage/admin-monitoring/adminMonitoringApi';

function DataTransPolicyChangeHistory() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  adminMonitoringApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 조건검색 적용일시 시작일, 종료일 기본값
  let today = HsLib.getTodayDate();
  let monthAgo = HsLib.getAfterDate('1M', today);

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    applyStartDate: today,
    applyEndDate: monthAgo,
    policyCode: '',
    policyName: '',
    functionLimitPolicy: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 자료전송 정책 변경이력 목록
  const [dataTransPolicy, setDataTransPolicy] = useState([
    {
      no: 1,
      applyDate: '2024.05.13',
      policyCode: '',
      policyName: '',
      settingClassification: '',
      functionLimitPolicy: '',
      periodClassification: '',
      functionPolicyApplyPeriod: '',
      fileNumberLimit: '',
      limitSize: '',
      transferLimitNumber: '',
      transferLimitSize: '',
      downloadLimitNumber: '',
      clipboardLimitFunction: '',
      clipboardLimitSize: '',
      clipboardLimitNumberOneDay: '',
      clipboardLimitSizeOneDay: '',
      clipboardHistorySave: '',
      originalSave: '',
      urlAutoConvert: '',
    },
  ]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: adminMonitoringApi,
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
    const gridInfo = await HsLib.getGridInfo('DataTransPolicy', adminMonitoringApi);

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
      await getDataTransPolicy({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
    }
  };

  const getDataTransPolicy = (parameters) => {
    // 자료전송 정책 변경이력 목록 조회 api 추가.
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
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <Stack colSpan={1.5} direction="row" alignItems="center">
            <LabelInput
              type="date1"
              label="적용일시"
              name="applyStartDate"
              sx={{ maxWidth: '150px', minWidth: '150px' }}
              value={parameters.applyStartDate}
              onChange={changeParameters}
            />
            &nbsp;~&nbsp;
            <LabelInput
              type="date1"
              name="applyEndDate"
              sx={{ maxWidth: '150px', minWidth: '150px' }}
              value={parameters.applyEndDate}
              onChange={changeParameters}
            />
          </Stack>
          <LabelInput label="정책코드" name="policyCode" />
          <LabelInput label="정책명" name="policyName" />
          <LabelInput type="select" label="기능제한정책" name="functionLimitPolicy" />
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
            {
              label: '엑셀',
              callBack: handleExcelButtonClick,
              variant: 'outlined',
            },
            {
              label: 'PDF',
              variant: 'outlined',
              callBack: handlePdfButtonClick,
            },
          ]}
        />
      </GridItem>

      <GridItem item>
        <ReactTable
          listFuncName="getDataTransPolicy"
          columns={columns}
          data={dataTransPolicy}
          setData={setDataTransPolicy}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

DataTransPolicyChangeHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DataTransPolicyChangeHistory;
