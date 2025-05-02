// libraries
import { useCallback, useEffect, useState,useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Link, Stack } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import TreeList from '@components/mantis/tree/TreeList';
import MainCard from '@components/mantis/MainCard';
// functions
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';
import { AuthInstance } from '@modules/axios';
import deptListApi from '@api/system/deptListApi';

function DeptListPopup() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  deptListApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall] = useApi();

  // 리스트 목록.
  const [deptList, setDeptList] = useState([]);

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 사용정책 콤보 데이터
  const [policyCdData] = useState([]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: deptListApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  // 검색.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    deptName: '',
    policyCd: '',
    parentDeptSeq: '',
  });

  // cell customizing
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'deptName':
          column.Cell = (props) => {
            return reunderDetpNameCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });

    setColumns(gridColumns);
  };

  // 관리자명 cell render
  const reunderDetpNameCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => doSendData(original.id, original.deptName)}
      >
        {original.deptName}
      </Link>
    );
  }, []);

  const doSendData = (deptSeq, deptName) => {
    // 존재여부 체크 후 실행.
    if ('setDeptName' in opener) opener.setDeptName(deptName);
    if ('setDeptSeq' in opener) opener.setDeptSeq(deptSeq);
    window.close();
  };

  //초기화
  const init = async () => {
    // 테이블 정보 가져오기
    const gridInfo = await HsLib.getGridInfo('DeptList', deptListApi);

    // 부서목록 요청
    const deptInfo = await apiCall(deptListApi.getDeptList, {
      ...parameters,
      size: gridInfo.listInfo.size,
    });

    // 부서트리 요청
    const deptTreeInfo = await apiCall(deptListApi.getDeptTree);

    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      // 테이블, 컬럼정보 응답처리
      responseGridInfo(gridInfo);
      // 부서목록 응답처리
      responseDeptList(deptInfo);
      // 부서트리 응답처리
      responseTreeList(deptTreeInfo);
    });
  };

  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = async (p_gridInfo) => {
    // 컬럼정보 재구성
    makeColumns(p_gridInfo.columns);
    // 컬럼정보 상태값 변경
    // setColumns(p_gridInfo.columns);
    // 테이블정보 상태값 변경
    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });
    // 검색조건 변경
    setParameters({ ...parameters, size: p_gridInfo.listInfo.size });
  };

  // 부서 응답처리
  const responseDeptList = async (p_deptList) => {
    if (p_deptList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_deptList.data.totalElements };
      });
      // 부서목록 상태값 변경
      setDeptList(p_deptList.data.content);
    }
  };

  // 부서 트리 조회
  const responseTreeList = async (p_treeList) => {
    if (p_treeList.status === 200) {
      setData(p_treeList.data);
    }
  };

  //테이블 조회
  const getDeptList = async (parameters) => {
    const result = await apiCall(deptListApi.getDeptList, parameters);
    if (result.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: result.data.totalElements };
      });
      setDeptList(result.data.content);
    }
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    init();
    return () => source.cancel();
  }, []);

  const [data, setData] = useState();

  // Tree select 핸들러
  const handleSelect = (event, nodeIds) => {
    setParameters({
      ...parameters,
      parentDeptSeq: nodeIds,
    });

    getDeptList(parameters);
  };

  return (
    <>
      <GridItem spacing={2} container divideColumn={5} p={2}>
        <MainCard
          title="부서 목록"
          colSpan={1}
          sx={{
            height: 'calc(100vh - 200px)',
          }}
          contentSX={{ height: 'calc(100vh - 240px)', pb: '15px', overflow: 'hidden' }}
        >
          <TreeList
            sx={{ maxHeight: '580px', maxWidth: '250px' }}
            searchOptions={{
              placeHolder: '부서명',
            }}
            data={data}
            setData={setData}
            onNodeSelect={handleSelect}
          />
        </MainCard>
        <GridItem container divideColumn={1} colSpan={4}>
          <GridItem container direction="column" spacing={2}>
            <SearchInput
              value={parameters.searchAll}
              onChange={changeParameters}
              placeholder="부서 코드 / 부서명"
              onSearch={() => getDeptList(parameters)}
            >
              <GridItem
                container
                divideColumn={3}
                spacing={2}
                sx={{
                  pr: 5,
                  '& .text': { maxWidth: '100px', minWidth: '100px' },
                  '.inputBox': { maxWidth: '200px', minWidth: '200px' },
                }}
              >
                <LabelInput
                  label="부서명"
                  name="deptName"
                  value={parameters.deptName}
                  onChange={changeParameters}
                  onKeyDown={(e) => {
                    e.key === 'Enter' ? getDeptList(parameters) : '';
                  }}
                />
                <LabelInput
                  type="select"
                  label="정책구분"
                  name="policyType"
                  list={policyCdData}
                  value={parameters.policyCd}
                  onChange={changeParameters}
                />
                <LabelInput
                  label="정책명"
                  name="policyCd"
                  list={policyCdData}
                  value={parameters.policyCd}
                  onChange={changeParameters}
                />
              </GridItem>
            </SearchInput>
            <GridItem item direction="row" directionHorizon="end">
              <Stack direction="row" alignContent="center" spacing={1.3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    getDeptList({
                      sortColumn: HsLib.camelCaseToSnakeCase(gridInfo.listInfo.sortColumn),
                    });
                    resetParameters();
                  }}
                >
                  <Replay />
                </Button>
                <ButtonSet
                  type="search"
                  options={[
                    {
                      label: '초기화',
                      callBack: () => {
                        resetParameters('', {
                          sortColumn: HsLib.camelCaseToSnakeCase(gridInfo.listInfo.sortColumn),
                          sortDirection: gridInfo.listInfo.sortDirection,
                        });

                        setGridInfo((prev) => ({
                          ...prev,
                          listInfo: {
                            ...prev.listInfo,
                            sortColumn: gridInfo.listInfo.sortColumn,
                            sortDirection: gridInfo.listInfo.sortDirection,
                          },
                        }));
                      },
                    },
                    {
                      label: '검색',
                      callBack: () => getDeptList(parameters),
                    },
                  ]}
                />
              </Stack>
            </GridItem>
            <GridItem item>
              <ReactTable
                listFuncName="getDeptList"
                columns={columns}
                data={deptList}
                setData={setDeptList}
                gridInfo={gridInfo}
                setGridInfo={setGridInfo}
                setParameters={setParameters}
                parameters={unControlRef}
              />
            </GridItem>
          </GridItem>
        </GridItem>
      </GridItem>
    </>
  );
}

DeptListPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="popup" title="부서 목록">
      {page}
    </Layout>
  );
};

export default DeptListPopup;
