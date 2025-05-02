// libraries
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { Stack, Typography, Divider } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
// components
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import MainCard from '@components/mantis/MainCard';
import ConfirmPop from '@components/modules/popover/ConfirmPop';
import ReactTable from '@components/modules/table/ReactTable';
// functions
import useInput from '@modules/hooks/useInput';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import permissionApi from '@api/system/permissionApi';
import menuApi from '@api/system/menuApi';
import { AuthInstance } from '@modules/axios';
// 조회/추가/수정/삭제(Check박스), 첫페이지(Radio박스)컬럼 설정(재귀함수)
const SubRoleRender = (menu, index, list, roleList) => {
  menu.children.map((data) => {
    if (data.type === 'item') {
      if (index !== '0') {
        if (data[`role_${index}`])
          if (data[`role_1`]) {
            roleList.push(`${data.menuId}${data[`role_1`]}`);
            list.push({
              value: `${data.menuId}${data[`role_${index}`]}`,
              sx: { borderBottom: '1px solid #e6ebf1', margin: 0 },
            });
          } else {
            list.push({
              value: `${data.menuId}`,
              sx: { borderBottom: '1px solid #e6ebf1', margin: 0 },
            });
          }
        else list.push({ id: data.menuId });
      } else {
        list.push({
          value: `${data.menuId}`,
          sx: { borderBottom: '1px solid #e6ebf1', margin: 0, justifyContent: 'center' },
        });
      }
    } else {
      SubRoleRender(data, index, list, roleList);
    }
  });
};

function Permission({ flag, permissionId }) {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  permissionApi.axios = instance;
  menuApi.axios = instance;
  // Router Hook(페이지 이동, 쿼리 파라미터 처리)
  const router = useRouter();
  // 메뉴별 체크박스 목록(변수(랜더링X),DOM접근)
  const renderRef = useRef({});
  // 전체 체크박스 목록(변수(랜더링X),DOM접근)
  const totalCheckList = useRef([]);
  // 체크박스 중 체크된 목록(변수(랜더링X),DOM접근)
  const checkList = useRef([]);
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      userPermissionName: '',
      useYn: '',
      menuUseYn: '',
      menuRoleList: [],
      firstPage: '',
      selectedMenu: '',
      sessionDuration: '',
    },
  });
  // 메뉴 목록 상태값
  const [menuList, setMenuList] = useState([]);
  // 메뉴선택(Select박스) 상태값
  const [selectedMenuList, setSelectedMenuList] = useState([]);
  // 전체 메뉴 상태값
  const [allMenuList, setAllMenuList] = useState([]);
  // 메뉴선택에 선택된 메뉴의 하위메뉴목록 상태값
  const [subMenuList, setSubMenuList] = useState([]);
  // PopOver 엘리먼트(출력위치) 상태값
  const [popTarget, setPopTarget] = useState(null);
  // 사용자, 관리자 세션 상태값
  const [sessionMap, setSessionMap] = useState([]);
  // 조회역할(Role 1)목록 상태값
  const [role1List, setRole1List] = useState([]);
  // 컬럼정보 상태값
  const [columns, setColumns] = useState([]);
  // 테이블정보 상태값
  const [gridInfo, setGridInfo] = useState({
    api: menuApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
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
  //초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보 요청
    const gridInfo = await HsLib.getGridInfo('PermissionForm', menuApi);
    if (gridInfo) {
      // 메뉴목록 요청
      const menuList = await apiCall(menuApi.getMenuList, {
        ...parameters,
        useYn: methods.getValues('menuUseYn'),
        isMenu: false,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
      // 권한상세정보 요청
      const permissionDetails = await apiCall(permissionApi.getPermissionDetails, permissionId);
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(gridInfo);
        // 메뉴목록 응답처리
        responseMenuList(menuList);
        // 권한상세정보 응답처리
        responsePermissionDetails(permissionDetails);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_gridInfo) => {
    if (p_gridInfo) {
      // 컬럼정보 재구성
      makeColumns(p_gridInfo.columns);
      // 컬럼정보 상태값 변경
      // setColumns(p_gridInfo.columns);
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
  // 메뉴목록 응답처리
  const responseMenuList = (p_menuList) => {
    if (p_menuList.status === 200 && p_menuList.data.menuList) {
      const menuList = [];

      p_menuList.data.menuList.map((data) => {
        menuList.push({
          label: data.title,
          value: data.menuId,
        });
      });

      setGridInfo((prev) => {
        return { ...prev, total: p_menuList.data.menuList.length };
      });

      setSelectedMenuList(menuList);
      setMenuList(p_menuList.data.menuList);
      setAllMenuList(p_menuList.data.menuList);
      setSubMenuList(p_menuList.data.menuList);
      makeCheckBoxList(p_menuList.data.menuList);
      methods.setValue('selectedMenu', '');
    }
  };
  // 권한상세정보 응답처리
  const responsePermissionDetails = (p_permissionDetails) => {
    if (p_permissionDetails.status === 200) {
      for (const key in p_permissionDetails.data) {
        if (key === 'menuRoleList') {
          checkList.current = p_permissionDetails.data[key];
        } else methods.setValue(key, p_permissionDetails.data[key]);
      }
    }
  };
  // 메뉴목록만 출력
  const getMenuList = async ({ useYn, ...parameters }) => {
    const result = await apiCall(menuApi.getMenuList, {
      useYn,
      isMenu: false,
      ...parameters,
    });

    // if (result.status === 200) {
    if (result.status === 200 && result.data.menuList) {
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 메뉴목록 응답처리
        responseMenuList(result);
      });
    } else {
      result.data.menuList = [];
      unstable_batchedUpdates(() => {
        // 메뉴목록 응답처리
        responseMenuList(result);
      });
    }
  };
  // 메뉴선택(Select박스) 변경 시 메뉴별 체크박스 목록 생성
  const makeCheckBoxList = (p_subMenuList) => {
    const totalList = [];
    const roleRenderList = {};
    const tempList = [];
    p_subMenuList.map((data) => {
      for (let i = 1; i <= 4; i++) {
        const checkBoxList = [];
        const roleList = [];
        // 조회/추가/수정/삭제(Check박스)컬럼 설정
        SubRoleRender(data, String(i), checkBoxList, roleList);
        roleRenderList[data.id] = {
          ...roleRenderList[data.id],
          [i]: checkBoxList,
        };
        // setRole1List(roleList);
        roleList.forEach((item) => {
          tempList.push(item);
        });
        totalList.push(...checkBoxList.filter((data) => data.value));
      }
    });
    // 조회역할(Role 1)목록 상태값 변경
    setRole1List(tempList);
    // 메뉴별 체크박스 목록 변경
    renderRef.current = roleRenderList;
    // 전체 체크박스 목록 변경
    if (totalCheckList.current.length === 0) totalCheckList.current = totalList;
  };
  // 선택된 권한 상세값 출력
  // const getPermissionDetails = async () => {
  //   const result = await apiCall(permissionApi.getPermissionDetails, permissionId);
  //   if (result.status === 200) {
  //     responsePermissionDetails(result);
  //   }
  // };
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    const formSubscription = methods.watch((map, names) => {
      const fieldName = names.name;
      const fieldValue = map[fieldName];
      if (fieldName === 'rank' && sessionMap.length !== 0 && fieldValue !== '') {
        let [mgr, user, temp] = sessionMap;
        if (mgr.name !== 'MGR_TIMEOUT') {
          mgr = user;
          user = temp;
        }
        if (fieldValue <= 3) {
          methods.setValue('sessionDuration', mgr.value);
        } else {
          methods.setValue('sessionDuration', user.value);
        }
      }
    });
    return () => formSubscription.unsubscribe();
  }, [methods.watch, sessionMap]);
  // 입력값 확인
  const checkValidate = (data) => {
    let message = '';

    // 클릭한 조회 id
    let intersectionList = data['menuRoleList'].filter((data) => role1List.includes(data));
    let substrData = intersectionList.map((data) => data.substr(0, 19));

    if (!data['firstPage']) message = '첫 페이지를 1개 이상 선택해주시기 바랍니다.';
    else if (data['menuRoleList'].length === 0)
      message = '메뉴 별 권한를 1개 이상 선택해주시기 바랍니다.';

    if (!substrData.includes(data['firstPage']))
      message = '첫 페이지는 해당 메뉴의 조회 권한이 필요합니다.';
    if (message) {
      openModal({
        message: message,
      });
      return false;
    } else return true;
  };
  // 신규 데이터 저장
  const insertPermission = async (data) => {
    // 입력값 확인
    if (checkValidate(data)) {
      data['firstPage'] = data['firstPage'].substr(0, 19);

      const result = await apiCall(permissionApi.insertPermission, data);
      if (result.status === 200) {
        let message;
        if (result.data === 1) message = '권한이 등록되었습니다.';
        else message = '권한 등록에 실패하였습니다.';
        openModal({
          message,
          onConfirm: () => router.push('/system/permission/permissionList'),
        });
      }
    }
  };
  // 변경 데이터 저장
  const updatePermission = async (data) => {
    // 입력값 확인
    if (checkValidate(data)) {
      data['firstPage'] = data['firstPage'].substr(0, 19);

      const result = await apiCall(permissionApi.updatePermission, data);
      if (result.status === 200) {
        let message;
        if (result.data === 1) message = '권한이 수정되었습니다.';
        else message = '권한 수정에 실패하였습니다.';
        openModal({
          message,
          onConfirm: () => router.push('/system/permission/permissionList'),
        });
      }
    }
  };
  // Select박스 변경 이벤트
  const handleChange = ({ value, name, type }) => {
    if (type === 'select') {
      if (name === 'selectedMenu') {
        // 메뉴선택(Select박스) 변경
        onSelectedMenuChange(value);
      } else if (name === 'menuUseYn') {
        // 메뉴목록만 출력
        getMenuList({ useYn: value, ...parameters });
      } else {
        return null;
      }
      return value;
    }
  };
  // 메뉴선택(Select박스) 변경
  const onSelectedMenuChange = (value) => {
    if (value) {
      const selectedMenu = menuList.find((data) => data.menuId === value);
      setSubMenuList([selectedMenu] || []);
      makeCheckBoxList([selectedMenu] || []);
    } else {
      setSubMenuList(allMenuList);
      makeCheckBoxList(allMenuList);
    }
  };
  // 컬럼정보 재구성
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'menuName':
          column.Cell = ({ row }) =>
            // 메뉴명 컬럼 생성(재귀함수)
            SubTitleRender({ menu: row.original });
          return column;
        case 'role_1':
          column.Cell = (props) => roleRender(props, 1);
          return column;
        case 'role_2':
          column.Cell = (props) => roleRender(props, 2);
          return column;
        case 'role_3':
          column.Cell = (props) => roleRender(props, 3);
          return column;
        case 'role_4':
          column.Cell = (props) => roleRender(props, 4);
          return column;
        case 'first':
          column.Cell = firstRender;
          return column;
        default:
          return column;
      }
    });
    setColumns(gridColumns);
  };
  // 메뉴명 컬럼 생성(재귀함수)
  const SubTitleRender = ({ menu, index, parentLength }) => {
    return (
      <Stack
        sx={{
          height: '100%',
          width: '100%',
          borderBottom: index !== parentLength && '1px solid #e6ebf1',
        }}
        key={menu.menuId}
        direction="row"
        alignItems="center"
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Typography
          align="center"
          sx={{
            height: 34,
            paddingY: 0.5,
            paddingX: menu.menuLevel !== 1 && 2,
            minWidth: menu.type !== 'item' ? 150 : undefined,
            maxWidth: menu.type !== 'item' ? 150 : undefined,
            overflow: menu.children.length === 1 && 'hidden',
            whiteSpace: 'normal',
            wordBreak: 'keep-all',
          }}
        >
          {menu.menuName}
        </Typography>
        {menu.children.length !== 0 && (
          <Stack sx={{ width: '100%' }}>
            {menu.children.map((data, index) =>
              SubTitleRender({ menu: data, index, parentLength: menu.children.length - 1 }),
            )}
          </Stack>
        )}
      </Stack>
    );
  };
  // 조회/추가/수정/삭제(Check박스)컬럼 생성
  const roleRender = useCallback(({ row }, index) => {
    const checkBoxList = renderRef.current[row.original.menuId]?.[index];

    if (checkBoxList)
      return (
        <GridItem container direction="column">
          <GridItem item>
            <LabelInput
              stacksx={{
                alignItems: 'stretch',
                '& label > span': { p: '9px' },
              }}
              direction="column"
              type="checkbox"
              name="menuRoleList"
              emptysx={{
                height: 35,
                borderBottom: '1px solid #e6ebf1',
              }}
              list={checkBoxList}
              totalList={totalCheckList.current}
              checkList={checkList.current}
            />
          </GridItem>
        </GridItem>
      );
    else return null;
  }, []);
  // 첫페이지(Radio박스)컬럼 생성
  const firstRender = useCallback(({ row }) => {
    const radioList = [];
    // 첫페이지(Radio박스) 컬럼 설정
    SubRoleRender(row.original, '0', radioList, '');

    return (
      <LabelInput
        stacksx={{ alignItems: 'stretch', width: '100%', '& label > span': { p: '9px' } }}
        direction="column"
        type="radio"
        name="firstPage"
        list={radioList}
      />
    );
  }, []);
  // JSX
  return (
    <>
      <MainCard
        title={`권한 ${flag === 'insert' ? '작성' : '수정'}`}
        sx={{
          overflow: 'visible',
          '& .MuiCardContent-root, & .MuiCardHeader-root': { padding: '0' },
        }}
        border={false}
        className="tableCard"
        secondary={
          <ButtonSet
            sx={{ marginLeft: 'auto !important' }}
            options={[
              {
                label: '저장',
                callBack: (event) => setPopTarget(event.currentTarget),
                // role: flag,
                color: 'primary',
              },
              {
                label: '취소',
                callBack: () => router.push('/system/permission/permissionList'),
                color: 'secondary',
              },
            ]}
          />
        }
      >
        <FormProvider {...methods}>
          <form
            id="permissionForm"
            onSubmit={methods.handleSubmit(flag === 'insert' ? insertPermission : updatePermission)}
          >
            <GridItem
              container
              divideColumn={3}
              borderFlag
              sx={{
                '& .text': { maxWidth: '180px !important', minWidth: '180px !important' },
                '.inputBox': { maxWidth: '200px', minWidth: '200px' },
                mb: 2,
              }}
            >
              <LabelInput
                type="select"
                label="메뉴 선택"
                name="selectedMenu"
                onHandleChange={handleChange}
                list={selectedMenuList}
                labelBackgroundFlag
              />
              <LabelInput
                type="select"
                label="메뉴 사용여부"
                name="menuUseYn"
                onHandleChange={handleChange}
                list={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
                labelBackgroundFlag
              />
              <LabelInput
                required
                maxLength={32}
                label="권한명"
                name="userPermissionName"
                placeholder="권한명을 입력해주세요"
                labelBackgroundFlag
              />
              <LabelInput
                required
                onlyNumber
                maxValue={32767}
                label="등급"
                name="rank"
                helperText="※낮은 값일수록 높은등급입니다."
                placeholder="등급을 입력해주세요"
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="사용여부"
                name="useYn"
                list={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
                labelBackgroundFlag
              />
              <LabelInput
                onlyNumber
                label="세션 유지시간"
                name="sessionDuration"
                placeholder="유지시간을 입력해주세요"
                labelBackgroundFlag
              />
            </GridItem>
            <GridItem item>
              <ReactTable
                id="PermissionForm"
                sx={{
                  '& .MuiTableCell-root': {
                    borderLeft: '1px solid #e6ebf1',
                    borderRight: '1px solid #e6ebf1',
                    padding: 0,
                  },
                  '& .MuiTableCell-root:first-of-type': {
                    paddingLeft: '0 !important',
                  },
                  '& .MuiTableCell-root:last-of-type': {
                    paddingX: '0 !important',
                  },
                  '& .MuiTableCell-root:last-child': {
                    paddingLeft: 3,
                  },
                  '& .MuiTableRow-root:hover': {
                    backgroundColor: 'white',
                  },
                }}
                columns={columns}
                data={subMenuList}
                gridInfo={gridInfo}
                disabledFooter
                parameters={unControlRef}
                setParameters={setParameters}
              />
            </GridItem>

            <GridItem item directionHorizon="end" sx={{ marginTop: '10px' }}>
              <ButtonSet
                options={[
                  {
                    label: '저장',
                    callBack: (event) => setPopTarget(event.currentTarget),
                    role: flag,
                    color: 'primary',
                  },
                  {
                    label: '취소',
                    callBack: () => router.push('/system/permission/permissionList'),
                    color: 'secondary',
                  },
                ]}
              />
            </GridItem>

            <ConfirmPop name="permissionForm" anchorEl={popTarget} anchorChange={setPopTarget} />
          </form>
        </FormProvider>
      </MainCard>
    </>
  );
}

// export default Permission;
export default React.memo(Permission);
