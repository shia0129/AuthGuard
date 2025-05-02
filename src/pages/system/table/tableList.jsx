// libraries
import { Replay } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
// functions
import tableListApi from '@api/system/tableListApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useAccess from '@modules/hooks/useAccess';
import useApi from '@modules/hooks/useApi';
import useInput from '@modules/hooks/useInput';

function TableList() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  tableListApi.axios = instance;
  // 권한반환 함수(상태값반환 Hook사용)
  const { insert, update } = useAccess();
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    listCode: '',
    listName: '',
  });
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 추가컬럼정보 상태값
  const [addColumn, setAddColumn] = useState({});
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: tableListApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 리스트 목록 상태값
  const [tableList, setTableList] = useState([]);
  // 변경한 목록 상태값
  const [updateList, setUpdateList] = useState([]);
  // 삭제 목록 상태값
  const [deleteList, setDeleteList] = useState([]);
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
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('TableList', tableListApi);
    if (gridInfo) {
      const tableList = await apiCall(tableListApi.getTableList, {
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // 코드목록 응답처리
        responseTableList(tableList);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    // 컬럼정보 상태값 변경
    setColumns(p_gridInfo.columns);
    // 추가컬럼정보 상태값 변경
    setAddColumn(p_gridInfo.addColumn);
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
  // 리스트목록 응답처리
  const responseTableList = (p_tableList) => {
    if (p_tableList.status === 200) {
      setDeleteList([]);
      setGridInfo((prev) => {
        return { ...prev, total: p_tableList.data.totalElements };
      });
      setTableList(p_tableList.data.content);
      setUpdateList(p_tableList.data.content);
    }
  };
  // 리스트목록만 출력
  const getTableList = async (parameters) => {
    const result = await apiCall(tableListApi.getTableList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (parameters.resetParameters) {
          resetParameters();
        }
        // 코드목록 응답처리
        responseTableList(result);
      });
    }
  };
  // (row)추가버튼 클릭 이벤트
  const handleAddColumnButtonClick = () => {
    // 맨위로 컬럼 추가
    const column = { id: HsLib.getId(tableList), ...addColumn };
    setUpdateList([column, ...tableList]);
    setTableList([column, ...tableList]);
  };
  // 삭제버튼 클릭 이벤트
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteTableList,
      });
    } else {
      openModal({
        message: `삭제할 컬럼을 우선 선택해 주십시오.`,
      });
    }
  };
  // 저장버튼 클릭 이벤트
  const handleInsertButtonClick = async () => {
    // Validation 체크
    if (HsLib.checkValidity(updateList, columns, openModal)) return;
    // 추가한 Row 리스트 (status: I)
    const insertList = updateList.filter((obj) => obj.status === 'I');
    // 중복 체크
    const duplicationResult = await apiCall(tableListApi.duplicationTableList, insertList);
    if (duplicationResult.status === 200 && duplicationResult.data === 'N') {
      openModal({
        message: '중복된 리스트 코드가 있습니다.',
      });
    } else {
      const result = await apiCall(tableListApi.saveTableList, updateList);
      if (result.status === 200) {
        setDeleteList([]);
        getTableList(parameters);
        openModal({
          message: '저장되었습니다.',
        });
      }
    }
  };
  // 리스트정보 삭제
  const deleteTableList = async () => {
    const result = await apiCall(
      tableListApi.deleteTableList,
      deleteList.map((item) => item.id),
    );
    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          getTableList(parameters);
          setDeleteList([]);
        },
      });
    }
  };
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getTableList(parameters)}>
          <GridItem
            container
            divideColumn={3}
            spacing={2}
            sx={{
              pr: 5,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              label="리스트 코드"
              name="listCode"
              value={parameters.listCode}
              onChange={changeParameters}
              onKeyDown={(e) => {
                e.key === 'Enter' ? getTableList(parameters) : '';
              }}
            />

            <LabelInput
              label="리스트 명"
              name="listName"
              value={parameters.listName}
              onChange={changeParameters}
              onKeyDown={(e) => {
                e.key === 'Enter' ? getTableList(parameters) : '';
              }}
            />
          </GridItem>
        </SearchInput>
        <GridItem item directionHorizon="space-between">
          <ButtonSet
            type="custom"
            options={[
              {
                label: '추가',
                callBack: handleAddColumnButtonClick,
                variant: 'outlined',
                color: 'secondary',
                role: 'insert',
              },
              {
                label: '저장',
                callBack: handleInsertButtonClick,
                variant: 'outlined',
                color: 'secondary',
                sx: { display: !insert && !update && 'none' },
              },
              {
                label: '삭제',
                callBack: handleDeleteButtonClick,
                variant: 'outlined',
                color: 'secondary',
                role: 'delete',
              },
            ]}
          />

          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => {
                getTableList({
                  sortColumn: HsLib.camelCaseToSnakeCase(gridInfo.listInfo.sortColumn),
                  resetParameters: true,
                });
                // resetParameters();
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
                  callBack: () => getTableList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>
        <GridItem item sx={{ width: '100%' }}>
          <ReactTable
            listFuncName="getTableList"
            columns={columns}
            data={tableList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setTableList}
            setUpdateData={setUpdateList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            setParameters={setParameters}
            parameters={unControlRef}
          />
        </GridItem>
      </GridItem>
      {/* {console.log('테이블관리 화면로딩... ')} */}
    </>
  );
}

TableList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default TableList;
