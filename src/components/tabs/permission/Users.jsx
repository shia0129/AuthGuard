// libraries
import { useState, useCallback, useEffect,useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack } from '@mui/material';
import ListIcon from '@mui/icons-material/ListOutlined';
import { unstable_batchedUpdates } from 'react-dom';
// components
import GridItem from '@components/modules/grid/GridItem';
import SearchInput from '@components/modules/input/SearchInput';
import LabelInput from '@components/modules/input/LabelInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import ReactTable from '@components/modules/table/ReactTable';
import UserChoiceModal from '@components/modal/system/permission/userChoiceModal';
import PermissionChangeModal from '@components/modal/system/permission/permissionChangeModal';
// functions
import useInput from '@modules/hooks/useInput';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import permissionApi from '@api/system/permissionApi';
import adminApi from '@api/system/adminApi';
import useApi from '@modules/hooks/useApi';

function Users({ permissionId }) {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  permissionApi.axios = instance;
  adminApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // Router Hook(페이지 이동, 쿼리 파라미터 처리)
  const router = useRouter();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    searchAll: '',
    userId: '',
    userName: '',
    userPermissionId: permissionId,
    userPermissionName: '',
    deleteYn: 'N',
    changePermissionId: '',
  });

  // 검색 조건 상태값
  const [usersParameters, setUsersParameters] = useState({
    userPermissionId: permissionId,
    deleteYn: 'N',
    searchAll: '',
  });
  // 사용자 목록 상태값
  const [userList, setUserList] = useState([]);
  // 전체 페이지수 상태값
  const [count, setCount] = useState(10);
  // 사용자추가 모달팝업 출력 상태값
  const [userAddOpen, setUserAddOpen] = useState(false);
  // 사용자권한변경 모달팝업 출력 상태값
  const [permissionUpdateOpen, setPermissionUpdateOpen] = useState(false);
  // 선택된 권한의 사용자 목록 상태값
  const [permissionUserList, setPermissionUserList] = useState([]);
  // 선택 목록 상태값
  const [checkList, setCheckList] = useState([]);
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: adminApi,
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
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보 요청
    const gridInfo = await HsLib.getGridInfo('SampleUserList2', permissionApi);
    // 사용자목록 요청
    const adminList = await apiCall(adminApi.getAdminList, {
      ...parameters,
      sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      size: gridInfo.listInfo.size,
    });
    // 일괄 변경처리
    unstable_batchedUpdates(() => {
      // 테이블, 컬럼정보 응답처리
      responseGridInfo(gridInfo);
      // 사용자목록 응답처리
      responseAdminList(adminList);
    });

    if (gridInfo) {
      // 컬럼정보 상태값 변경
      // setColumns(gridInfo.columns);
      // // 테이블정보 상태값 변경
      // setGridInfo((prev) => {
      //   return { ...prev, listInfo: gridInfo.listInfo };
      // });
      // // 검색조건 변경
      // setParameters({
      //   ...parameters,
      //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      //   size: gridInfo.listInfo.size,
      // });
      // // 선택된 권한의 사용자목록 출력
      // await getPermissionUserList({
      //   ...parameters,
      //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      //   size: gridInfo.listInfo.size,
      // });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    if (p_gridInfo) {
      // 컬럼정보 상태값 변경
      setColumns(p_gridInfo.columns);
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
    }
  };
  // 사용자목록 응답처리
  const responseAdminList = (p_adminList) => {
    if (p_adminList.status === 200) {
      setGridInfo((prev) => {
        return { ...prev, total: p_adminList.data.totalElements };
      });
      setPermissionUserList(p_adminList.data.content);
    }
  };

  // 선택된 권한의 사용자목록 출력
  const getPermissionUserList = useCallback(async (parameters) => {
    const result = await apiCall(adminApi.getAdminList, parameters);
    if (result.status === 200) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 사용자목록 응답처리
        responseAdminList(result);
      });
      // setGridInfo((prev) => {
      //   return { ...prev, total: result.data.totalElements };
      // });
      // setPermissionUserList(result.data.content);
    }
  }, []);
  // 사용자 목록 조회(선택된 권한이 아닌??? 확인필요)
  const getAdminList = useCallback(async (parameters) => {
    const result = await apiCall(adminApi.getAdminAllList, parameters);
    if (result.status === 200) {
      // 전체 페이지 수 계산.
      const totalCount = Math.ceil(result.data.length / 10);
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        setUserList(result.data);
        setCount(totalCount === 0 ? 1 : totalCount);
      });
    }
  }, []);
  // JSX
  return (
    <>
      <GridItem mt={2}>
        <GridItem spacing={2} container direction="column">
          <SearchInput onSearch={() => getPermissionUserList(parameters)}>
            <GridItem
              container
              divideColumn={4}
              spacing={2}
              sx={{
                pr: 10,
                '& .text': { maxWidth: '150px', minWidth: '150px' },
                '.inputBox': { maxWidth: '200px', minWidth: '200px' },
              }}
            >
              <LabelInput
                label="로그인ID"
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

          <GridItem item directionHorizon="space-between">
            <ButtonSet
              type="custom"
              options={[
                {
                  label: '사용자 추가',
                  color: 'secondary',
                  variant: 'outlined',
                  callBack: () => {
                    setUserAddOpen(true);
                    getAdminList(usersParameters);
                  },
                },
                {
                  label: '권한 변경',
                  color: 'secondary',
                  variant: 'outlined',
                  callBack: () => {
                    if (checkList.length === 0)
                      openModal({
                        message: '최소 1개 이상의 사용자를 선택해주세요.',
                      });
                    else setPermissionUpdateOpen(true);
                  },
                },
              ]}
            />
            <Stack childtype="dom" direction="row" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push('/system/permission/permissionList')}
              >
                <ListIcon />
                목록
              </Button>

              <ButtonSet
                type="search"
                sx={{ ml: '10px' }}
                options={[
                  {
                    label: '초기화',
                    callBack: resetParameters,
                  },
                  {
                    label: '검색',
                    callBack: () => getPermissionUserList(parameters),
                  },
                ]}
              />
            </Stack>
          </GridItem>
          <GridItem item>
            <ReactTable
              listFuncName="getAdminList"
              columns={columns}
              data={permissionUserList}
              checkList={checkList}
              onChangeChecked={setCheckList}
              setData={setPermissionUserList}
              gridInfo={gridInfo}
              setGridInfo={setGridInfo}
              parameters={unControlRef}
              setParameters={setParameters}
            />
          </GridItem>
        </GridItem>
        {/* 팝업 컴포넌트 */}
        {userAddOpen && (
          <UserChoiceModal
            open={userAddOpen}
            close={setUserAddOpen}
            userList={userList}
            count={count}
            searchCallBack={getAdminList}
            callBack={getPermissionUserList}
            parameters={usersParameters}
            setParameters={setUsersParameters}
            userPermissionId={permissionId}
          />
        )}
        <PermissionChangeModal
          open={permissionUpdateOpen}
          close={setPermissionUpdateOpen}
          callBack={getPermissionUserList}
          parameters={parameters}
          resetParameters={resetParameters}
          changeParameters={changeParameters}
          checkList={checkList}
          setCheckList={setCheckList}
        />
      </GridItem>
      {/* {console.log('사용자탭 화면로딩... ')} */}
    </>
  );
}

export default Users;
