import Layout from '@components/layouts';
import { useState, useEffect,useRef } from 'react';

// Project import
import cdsPreferencesApi from '@api/system-manage/cdsPreferencesApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import ReactTable from '@components/modules/table/ReactTable';
import useApi from '@modules/hooks/useApi';

// MUI
import { Stack } from '@mui/material';

function CdsPreferences() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();

  cdsPreferencesApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 검색조건 파라미터.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    system: '',
    tag: '',
    value: '',
    desc: '',
  });

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 스트리밍 전송이력 목록
  const [cdsPreferencesList, setCdsPreferencesList] = useState([
    {
      system: '시스템01',
      tag: '-',
      value: '-',
      desc: '-',
    },
  ]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: cdsPreferencesApi,
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
    const gridInfo = await HsLib.getGridInfo('CdsPreferences', cdsPreferencesApi);

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

      await getCdsPreferencesList({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
    }
  };

  const getCdsPreferencesList = (parameters) => {
    // 조회 api 추가.
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
            '& .text': { maxWidth: '150px', minWidth: '150px' },
            '.inputBox': { maxWidth: '200px', minWidth: '200px' },
          }}
        >
          <LabelInput
            type="select"
            label="시스템"
            name="system"
            list={[
              { value: '1', label: '외부시스템01' },
              { value: '2', label: '내부시스템01' },
            ]}
          />
          <LabelInput label="TAG" name="tag" />
          <LabelInput label="Value" name="value" />
          <LabelInput label="설명" name="desc" />
        </GridItem>
      </SearchInput>
      <GridItem item directionHorizon="end">
        <Stack direction="row" alignItems="center" spacing={1.3}>
          <ButtonSet
            type="search"
            options={[
              {
                label: '조회',
                variant: 'outlined',
                //   callBack: () => (),
              },
              {
                label: '추가',
                variant: 'outlined',
                //   callBack: () => (),
              },
              {
                label: '삭제',
                variant: 'outlined',
                //   callBack: () => (),
              },
              {
                label: '저장',
                variant: 'outlined',
                //   callBack: () => (),
              },
            ]}
          />
        </Stack>
      </GridItem>

      <GridItem item>
        <ReactTable
          listFuncName="getCdsPreferencesList"
          columns={columns}
          data={cdsPreferencesList}
          setData={setCdsPreferencesList}
          gridInfo={gridInfo}
          setGridInfo={setGridInfo}
          parameters={unControlRef}
          setParameters={setParameters}
        />
      </GridItem>
    </GridItem>
  );
}

CdsPreferences.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default CdsPreferences;
