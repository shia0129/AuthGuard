// libraries
import { useIntl } from 'react-intl';
import { useState, useEffect, useCallback,useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Link, Stack, Typography } from '@mui/material';
import { Group, Person } from '@mui/icons-material';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import CollapseTreeList from '@components/mantis/tree/CollapseTreeList';
import TreeList from '@components/mantis/tree/TreeList';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import GroupModal from '@components/modal/system/group/groupModal';
import DropDownButton from '@components/modules/button/DropDownButton';
import TreeListItem from '@components/mantis/tree/TreeListItem';
// functions
import groupApi from '@api/system/groupApi';
import useInput from '@modules/hooks/useInput';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import codeApi from '@api/system/codeApi';
function GroupList() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  groupApi.axios = instance;
  codeApi.axios = instance;
  // 다국어 처리 모듈.
  const intl = useIntl();
  // API 호출 함수
  const [apiCall, openModal, apiAllCall] = useApi();
  // 검색조건 파라미터(초기값 할당)
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    groupName: '',
    groupPname: '',
    groupDivision: '',
    deleteYn: '',
  });
  // 그룹 목록 상태값.
  const [groupList, setGroupList] = useState([]);
  // 그룹 트리 목록 상태값.
  const [treeList, setTreeList] = useState([]);
  // 그룹 트리 drop down 버튼 목록 중 선택된 index 상태값.
  const [dropDownIndex, setDropDownIndex] = useState(0);
  // 컬럼 정보 상태값.
  const [columns, setColumns] = useState([]);
  // 선택 목록 상태값.
  const [checkList, setCheckList] = useState([]);
  // 삭제 여부 코드 목록 상태값.
  const [deleteYnCodeList, setDeleteYnCodeList] = useState([]);
  // 그룹 구분 코드 목록 상태값.
  const [groupDivisionCodeList, setGroupDivisionCodeList] = useState([]);
  // Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);
  // Modal팝업 파라미터 상태값
  const [modalParams, setModalParams] = useState({});
  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: groupApi,
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
    return () => {
      source.cancel();
    };
  }, []);
  // 초기화 함수(테이블 정보 초기화, dropDownList 생성을 위해 동기 처리)
  const init = async () => {
    // 트리 드랍다운 목록.
    const dropDownList = [];
    let groupDivision = '';
    let groupTreeList = [];
    // 테이블, 컬럼정보
    const gridInfo = await HsLib.getGridInfo('GroupList', groupApi);
    if (gridInfo) {
      // 코드 타입 조회.
      const deleteYnCodeRequest = apiCall(codeApi.getComboInfo, 'DELETE_YN');
      const groupDivisionCodeRequest = apiCall(codeApi.getComboInfo, 'GROUP_TYPE');
      const [deleteYnCodeResult, groupDivisionCodeResult] = await apiAllCall([
        deleteYnCodeRequest,
        groupDivisionCodeRequest,
      ]);
      if (groupDivisionCodeResult.status === 200) {
        groupDivisionCodeResult.data.resultData.map((item) => {
          const data = {
            label: item.codeDesc,
            value: item.codeValue,
          };
          dropDownList.push(data);
          groupDivision = dropDownList[0].value;
        });
        groupTreeList = await apiCall(groupApi.getGroupTreeList, { groupDivision });
      }
      // 그룹정보 조회 요청.
      const groupList = await apiCall(groupApi.getGroupList, { ...parameters, size: 0 });
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // 조회조건 응답처리
        responseSearchCodeList(deleteYnCodeResult, groupDivisionCodeResult);
        if (groupDivisionCodeResult.status === 200) {
          // 그룹트리목록 응답처리
          responseGroupTreeList(groupTreeList);
        }
        // 그룹목록 응답처리
        responseGroupList(groupList);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    makeColumns(p_gridInfo.columns);
    // setColumns(gridInfo.columns);
    setGridInfo((prev) => ({ ...prev, listInfo: p_gridInfo.listInfo }));
    setParameters({ ...parameters, size: p_gridInfo.listInfo.size });
  };
  // 조회조건 응답처리
  const responseSearchCodeList = (p_deleteYnCodeResult, p_groupDivisionCodeResult) => {
    // 조회 코드 select 목록 set.
    if (p_deleteYnCodeResult.status === 200) {
      setDeleteYnCodeList(
        p_deleteYnCodeResult.data.resultData.map((item) => ({
          label: item.codeDesc,
          value: item.codeValue,
        })),
      );
    }
    if (p_groupDivisionCodeResult.status === 200) {
      setGroupDivisionCodeList(
        p_groupDivisionCodeResult.data.resultData.map((item) => {
          const data = {
            label: item.codeDesc,
            value: item.codeValue,
          };
          return data;
        }),
      );
    }
  };
  // 그룹목록 응답처리
  const responseGroupList = (p_groupList) => {
    if (p_groupList.status === 200) {
      setGroupList(p_groupList.data.content);
      setGridInfo((prev) => {
        return { ...prev, total: p_groupList.data.totalElements };
      });
    }
  };
  // 그룹트리목록 응답처리
  const responseGroupTreeList = (p_groupTreeList) => {
    if (p_groupTreeList.status === 200) {
      setTreeList(p_groupTreeList.data);
    }
  };
  // 그룹목록만 조회
  const getGroupList = async (parameters) => {
    // 그룹정보 조회 요청.
    const result = await apiCall(groupApi.getGroupList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (parameters.resetParameters) {
          resetParameters();
        }
        // 그룹목록 응답처리
        responseGroupList(result);
      });
    }
  };
  // 그룹트리목록만 조회
  const getGroupTreeList = async (groupDivision) => {
    const result = await apiCall(groupApi.getGroupTreeList, {
      groupDivision,
    });
    if (result.status === 200) {
      responseGroupTreeList(result);
    }
  };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'groupName':
          column.Cell = (props) => {
            // 그룹명 컬럼 생성
            return reunderGroupNameCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };
  // 선택한 정보 삭제
  const deleteGroup = async () => {
    // default message.
    let message = '그룹에 존재하는 구성원이 존재하여 삭제할 수 없습니다.';
    // 멤버가 존재하는 그룹 인덱스.
    const checkGroupIndex = checkList.findIndex((item) => item.memberCount !== 0);
    if (checkGroupIndex !== -1) {
      openModal({
        message,
      });
      return;
    }

    const result = await apiCall(
      groupApi.deleteGroup,
      checkList.map((item) => item.id),
    );
    if (result.status === 200) {
      message = `${result.data}건이 삭제되었습니다.`;
      openModal({
        message,
        onConfirm: () => {
          setCheckList([]);
          getGroupList(parameters);
        },
      });
    }
  };
  // 삭제 버튼 클릭 이벤트
  const handleDeleteButtonClick = () => {
    if (checkList.length !== 0) {
      openModal({
        message: `${checkList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteGroup,
      });
    } else {
      openModal({
        message: `삭제할 항목을 먼저 선택해주세요.`,
      });
    }
  };
  // 추가버튼, 역할명 클릭 이벤트
  const handleInsertUpdateButtonClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };
  // 역할명 컬럼 생성
  const reunderGroupNameCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleInsertUpdateButtonClick('update', original.id)}
      >
        {original.groupName}
      </Link>
    );
  }, []);
  // 그룹 트리 렌더.
  const renderTree = (treeList = []) =>
    treeList.map((item) => {
      const isDelete = item.deleteYn === 'Y' ? true : false;
      const childList = [];
      if (Array.isArray(item.children) && item.children.length !== 0) {
        childList.push(renderTree(item.children));
      }
      if (Array.isArray(item.memberList) && item.memberList.length !== 0) {
        childList.push(renderTree(item.memberList));
      }
      return (
        <TreeListItem
          key={item.id}
          nodeId={item.id}
          label={<Typography color={isDelete ? 'red' : 'black'}>{item.label}</Typography>}
          endIcon={
            item.type === 'group' ? <Group color={isDelete ? 'red' : 'black'} /> : <Person />
          }
        >
          {childList.map((child) => child)}
        </TreeListItem>
      );
    });
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getGroupList(parameters)}>
          <GridItem
            container
            divideColumn={4}
            sx={{
              '& .text.inputText': {
                maxWidth: '150px',
                minWidth: '150px',
              },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              label="그룹명"
              name="groupName"
              inputProps={{ maxLength: 32 }}
              value={parameters.groupName}
              onChange={changeParameters}
            />
            <LabelInput
              label="상위 그룹명"
              name="codeDesc"
              inputProps={{ maxLength: 32 }}
              value={parameters.groupPname}
              onChange={changeParameters}
            />
            <LabelInput
              type="select"
              label="그룹 구분"
              name="groupDivision"
              list={groupDivisionCodeList}
              value={parameters.groupDivision}
              onChange={changeParameters}
            />
            <LabelInput
              type="select"
              label="삭제 여부"
              name="deleteYn"
              list={deleteYnCodeList}
              value={parameters.deleteYn}
              onChange={changeParameters}
            />
          </GridItem>
        </SearchInput>
        <GridItem item directionHorizon="space-between">
          <ButtonSet
            options={[
              {
                label: intl.formatMessage({ id: 'btn-add' }),
                callBack: () => handleInsertUpdateButtonClick('insert'),
                variant: 'outlined',
              },
              {
                label: intl.formatMessage({ id: 'btn-delete' }),
                color: 'secondary',
                callBack: handleDeleteButtonClick,
                variant: 'outlined',
              },
            ]}
          />

          <Stack childtype="dom" direction="row" justifyContent="flex-end">
            <Button
              color="secondary"
              variant="outlined"
              sx={{ mr: '10px' }}
              onClick={() => {
                getGroupList({ resetParameters: true });
                // resetParameters();
              }}
            >
              <Replay />
            </Button>
            <ButtonSet
              type="search"
              options={[
                { label: intl.formatMessage({ id: 'btn-reset' }), callBack: resetParameters },
                {
                  label: intl.formatMessage({ id: 'btn-search' }),
                  callBack: () => getGroupList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>
        <GridItem container item direction="row">
          <GridItem item>
            <CollapseTreeList defaultOpen>
              <Stack spacing={2}>
                <DropDownButton
                  datas={groupDivisionCodeList}
                  setIndex={setDropDownIndex}
                  transitionProps={{ itemOnclick: (item) => getGroupTreeList(item.value) }}
                />
                <TreeList
                  searchOptions={{ placeHolder: '그룹명을 입력하세요.' }}
                  data={treeList}
                  setData={setTreeList}
                >
                  {renderTree(treeList)}
                </TreeList>
              </Stack>
            </CollapseTreeList>
          </GridItem>
          <GridItem item xs>
            <ReactTable
              listFuncName="getGroupList"
              columns={columns}
              data={groupList}
              setData={setGroupList}
              checkList={checkList}
              onChangeChecked={setCheckList}
              gridInfo={gridInfo}
              setGridInfo={setGridInfo}
              parameters={unControlRef}
              setParameters={setParameters}
            />
          </GridItem>
        </GridItem>
      </GridItem>
      {modalOpen && (
        <GroupModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          groupList={groupList}
          deleteYnCodeList={deleteYnCodeList}
          groupDivisionCodeList={groupDivisionCodeList}
          getGroupList={() => {
            getGroupList(parameters);
            getGroupTreeList(groupDivisionCodeList[`${dropDownIndex}`].value);
          }}
        />
      )}
      {/* {console.log('그룹관리 화면로딩... ')} */}
    </>
  );
}

GroupList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default GroupList;
