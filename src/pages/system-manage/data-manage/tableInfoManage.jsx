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
import codeApi from '@api/system/codeApi';

function TableInfoManage() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  codeApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    code: '',
    englishName: '',
    koreaName: '',
    inspectFunction: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 테이블 정보 관리 목록
  const [tableInfoManage, setTableInfoManage] = useState([
    {
      code: '',
      englishName: '',
      koreaName: '',
      maximumAllowRow: '',
      alarmCreatRow: '',
      deleteRow: '',
      inspectFunction: '',
      writer: '',
    },
  ]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: codeApi,
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
    const gridInfo = await HsLib.getGridInfo('TableInfoManage', codeApi);

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
      await getTableInfoManage({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
    }
  };

  const getTableInfoManage = (parameters) => {
    // 테이블 정보 관리 조회 api 추가.
  };

  const handleSelectButtonClick = () => {
    console.log('조회버튼클릭');
  };

  const handleAddButtonClick = () => {
    console.log('추가버튼클릭');
  };

  const handleDeleteButtonClick = () => {
    console.log('삭제버튼클릭');
  };

  const handleSaveButtonClick = () => {
    console.log('저장버튼클릭');
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
            '& .text': { maxWidth: '100px', minWidth: '100px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput label="코드" name="code" />
          <LabelInput label="영문명" name="englishName" />
          <LabelInput label="한글명" name="koreaName" />
          <LabelInput type="select" label="감사기능" name="inspectFunction" />
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
              callBack: handleAddButtonClick,
              variant: 'outlined',
            },
            {
              label: '삭제',
              callBack: handleDeleteButtonClick,
              variant: 'outlined',
            },
            {
              label: '저장',
              callBack: handleSaveButtonClick,
              variant: 'outlined',
            },
          ]}
        />
      </GridItem>

      <GridItem item>
        <ReactTable
          listFuncName="getTableInfoManage"
          columns={columns}
          data={tableInfoManage}
          setData={setTableInfoManage}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

TableInfoManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default TableInfoManage;
