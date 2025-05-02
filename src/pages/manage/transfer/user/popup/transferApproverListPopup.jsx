import transferUserApi from '@api/transfer/transferUserApi';
import Layout from '@components/layouts';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import TreeList from '@components/mantis/tree/TreeList';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import deptListApi from '@api/system/deptListApi';
import useInput from '@modules/hooks/useInput';
import { Box, Link } from '@mui/material';
import { useEffect, useCallback, useState, useRef } from 'react';
import MainCard from '@components/mantis/MainCard';
import { unstable_batchedUpdates } from 'react-dom';

function TransferApproverListPopup() {
  const { instance, source } = AuthInstance();
  transferUserApi.axios = instance;
  deptListApi.axios = instance;

  // API, openModal 호출 함수
  const [apiCall] = useApi();

  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    deptName: '',
    userId: '',
    userName: '',
  });

  // 관리자 목록
  const [gridList, setGridList] = useState([]);

  // 체크박스 선택 목록
  const [gridCheckList, setGridCheckList] = useState([]);

  const [data, setData] = useState();

  // Tree 선택, 확장 값
  const [expanded, setExpanded] = useState(['root']);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: transferUserApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  // array타입의 값을 string으로 변환
  const arrayValueToString = (array) => {
    return array.map((value) => {
      return value.toString();
    });
  };

  // Tree 확장 핸들러
  const handleToggle = (event, nodeIds) => {
    if (event.target?.id === 'expand_icon' || event.target?.id === 'collapse_icon')
      setExpanded(arrayValueToString(nodeIds));
  };

  // 부서 트리 조회
  const responseTreeList = async (p_treeList) => {
    if (p_treeList.status === 200) {
      setData(p_treeList.data);
    }
  };

  // Tree select 핸들러
  const handleSelect = (event, nodeIds) => {
    setParameters({
      ...parameters,
      parentDeptSeq: nodeIds,
    });

    // getDeptList(parameters);
  };

  // cell customizing
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'userName':
          column.Cell = (props) => {
            return renderUserNameCell(props, column);
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
  const renderUserNameCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => doSendData(original.id, original.deptName, original.userName)}
      >
        {original.userName}
      </Link>
    );
  }, []);

  const doSendData = (userSeq, deptName, userName) => {
    opener.setApproverDeptName(deptName);
    opener.setApproverName(userName);
    opener.setApproverSeq(userSeq);
    window.close();
  };

  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('TransferUserList', transferUserApi);

    const transferUserList = await apiCall(transferUserApi.getApproverList, parameters);

    // 부서트리 요청
    const deptTreeInfo = await apiCall(deptListApi.getDeptTree);

    unstable_batchedUpdates(() => {
      // 테이블, 컬럼정보 응답처리s
      responseGridInfo(gridInfo);

      responseTreeList(deptTreeInfo);

      responsetTransferUserList(transferUserList);
    });
  };
  const responseGridInfo = (p_gridInfo) => {
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

  const responsetTransferUserList = (p_transferUserList) => {
    if (p_transferUserList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_transferUserList.data.totalElements };
      });
      setGridList(p_transferUserList.data.content);
    }
  };

  // 결재자 리스트
  const getApproverList = async (parameters) => {
    const result = await apiCall(transferUserApi.getApproverList, parameters);

    if (result.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: result.data.totalElements };
      });
      setGridList(result.data.content);
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
    // doEdit();
    return () => source.cancel();
  }, []);

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
        <GridItem container direction="column" spacing={2} colSpan={4}>
          <SearchInput onSearch={() => getApproverList(parameters)}>
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
                  e.key === 'Enter' ? getApproverList(parameters) : '';
                }}
              />
              <LabelInput
                label="사용자 ID"
                name="userId"
                value={parameters.userId}
                onChange={changeParameters}
              />
              <LabelInput
                label="사용자명"
                name="userName"
                value={parameters.userName}
                onChange={changeParameters}
              />
            </GridItem>
          </SearchInput>

          <GridItem item directionHorizon="end">
            <ButtonSet
              type="search"
              options={[
                {
                  label: '검색',
                  callBack: () => {
                    getApproverList(parameters);
                  },
                  color: 'primary',
                  variant: 'contained',
                },
              ]}
            />
          </GridItem>

          <GridItem item xs sx={{ minWidth: 0 }}>
            <ReactTable
              listFuncName="getApproverList"
              columns={columns}
              data={gridList}
              setData={setGridList}
              checkList={gridCheckList}
              onChangeChecked={setGridCheckList}
              gridInfo={gridInfo}
              setGridInfo={setGridInfo}
              setParameters={setParameters}
              parameters={unControlRef}
            />
          </GridItem>
        </GridItem>
      </GridItem>
    </>
  );
}

TransferApproverListPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="popup" title="결재자 지정">
      {page}
    </Layout>
  );
};

export default TransferApproverListPopup;
