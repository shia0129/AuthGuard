// libraries
import { useEffect, useState,useRef } from 'react';
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

function AdminReport() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  adminMonitoringApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    registerId: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 관리자 리포트 목록
  const [adminReport, setAdminReport] = useState([
    {
      day: '매일',
      reportTime: '00:00',
      adminId: 'admin',
      statisticsMenu: 'ST101',
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
    const gridInfo = await HsLib.getGridInfo('AdminReport', adminMonitoringApi);

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
      await getAdminReport({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
    }
  };

  const getAdminReport = (parameters) => {
    // 관리자 리포트 목록 조회 api 추가.
  };

  const handleSelectButtonClick = () => {
    console.log('조회버튼클릭');
  };

  const handleInsertButtonClick = () => {
    console.log('추가버튼클릭');
  };

  const handleTransferButtonClick = () => {
    console.log('1회 전송버튼클릭');
  };

  return (
    <GridItem spacing={2} container direction="column">
      <SearchInput>
        <GridItem
          container
          divideColumn={1}
          spacing={2}
          sx={{
            pr: 5,
            '& .text': { maxWidth: '100px', minWidth: '100px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput label="관리자ID" name="adminID" />
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
              label: '추가',
              callBack: handleInsertButtonClick,
              variant: 'outlined',
            },
            {
              label: '1회 전송',
              callBack: handleTransferButtonClick,
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>

      <GridItem item>
        <ReactTable
          listFuncName="getAdminReport"
          columns={columns}
          data={adminReport}
          setData={setAdminReport}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

AdminReport.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AdminReport;
