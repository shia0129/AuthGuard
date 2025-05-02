// libraries
import { useState, useEffect } from 'react';
import { useCallback,useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { Link } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
import RoleModal from '@components/modal/system/role/roleModal';
// functions
import roleApi from '@api/system/roleApi';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
function RoleList() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  roleApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    roleName: '',
    roleCode: '',
    menuCode: '',
    menuName: '',
    headerHeight: '40px',
    itemHeight: '40px',
  });
  // Modal팝업 오픈여부 상태값
  const [modalOpen, setModalOpen] = useState(false);
  // Modal팝업 파라미터 상태값
  const [modalParams, setModalParams] = useState({});
  // 역할목록 상태값
  const [roleList, setRoleList] = useState([]);
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: roleApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
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
    return () => {
      source.cancel();
    };
  }, []);
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보 요청
    const gridInfo = await HsLib.getGridInfo('RoleList', roleApi);
    // 역할목록 요청
    const roleList = await apiCall(roleApi.getRoleList, {
      ...parameters,
      size: gridInfo.listInfo.size,
    });
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      // 테이블, 컬럼정보 응답처리
      responseGridInfo(gridInfo);
      // 역할목록 응답처리
      responseRoleList(roleList);
    });
  };
  // 테이블, 컬럼정보 응답처리
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
  // 역할목록 응답처리
  const responseRoleList = (p_roleList) => {
    if (p_roleList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_roleList.data.totalElements };
      });
      // 역할목록 상태값 변경
      setRoleList(p_roleList.data.content);
    }
  };
  // 역할목록만 출력
  const getRoleList = async (parameters) => {
    // 역할목록 요청
    const result = await apiCall(roleApi.getRoleList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        if (!parameters) {
          resetParameters();
        }
        // 역할목록 응답처리
        responseRoleList(result);
      });
    }
  };
  // 추가버튼, 역할명 클릭 이벤트
  const handleInsertUpdateButtonClick = (flag, id) => {
    setModalParams({ flag: flag, id: id });
    setModalOpen(true);
  };
  // 삭제 버튼 클릭 이벤트
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteRole,
      });
    } else {
      openModal({
        message: `삭제할 항목을 먼저 선택해주세요.`,
      });
    }
  };
  // 선택한 정보 삭제
  const deleteRole = async () => {
    const result = await apiCall(roleApi.deleteRole, deleteList);

    if (result.status === 200) {
      let message = `${result.data}건이 삭제되었습니다.`;

      if (result.data === 0) message = '권한에 할당된 롤을 제거 후 다시 시도해주십시오.';
      openModal({
        message,
        onConfirm: () => {
          setDeleteList([]);
          getRoleList(parameters);
        },
      });
    }
  };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'roleName':
          column.Cell = (props) => {
            // 역할명 컬럼 생성
            return reunderRoleNameCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    // 컬럼정보 상태값 변경
    setColumns(gridColumns);
  };
  // 역할명 컬럼 생성
  const reunderRoleNameCell = useCallback(({ row: { original } }) => {
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
        {original.roleName}
      </Link>
    );
  }, []);
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getRoleList(parameters)}>
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
              label="롤 명칭"
              name="roleName"
              value={parameters.roleName}
              onChange={changeParameters}
            />

            <LabelInput
              label="롤 코드"
              name="roleCode"
              value={parameters.roleCode}
              onChange={changeParameters}
            />

            <LabelInput
              label="메뉴 명"
              name="menuName"
              value={parameters.menuName}
              onChange={changeParameters}
            />
          </GridItem>
        </SearchInput>

        <GridItem item directionHorizon="space-between">
          <ButtonSet
            options={[
              {
                label: '추가',
                callBack: () => handleInsertUpdateButtonClick('insert', ''),
                // callBack: handleInsertButtonClick,
                variant: 'outlined',
                role: 'insert',
              },
              {
                label: '삭제',
                callBack: handleDeleteButtonClick,
                color: 'secondary',
                variant: 'outlined',
                role: 'delete',
              },
            ]}
          />

          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              onClick={() => {
                getRoleList();
                // resetParameters();
              }}
            >
              <Replay />
            </Button>
            <ButtonSet
              type="search"
              options={[
                { label: '초기화', callBack: resetParameters },
                {
                  label: '검색',
                  callBack: () => getRoleList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>

        <GridItem item>
          <ReactTable
            listFuncName="getRoleList"
            columns={columns}
            data={roleList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setData={setRoleList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            parameters={unControlRef}
            setParameters={setParameters}
          />
        </GridItem>
      </GridItem>
      {modalOpen && (
        <RoleModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getRoleList={getRoleList}
        />
      )}
      {/* {console.log('롤관리 화면로딩... ')} */}
    </>
  );
}

RoleList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default RoleList;
