// libraries
import { Stack } from '@mui/material';
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// components
import PopUp from '@components/modules/common/PopUp';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import { iconListGenerate } from '@modules/common/menuParser';
// functions
import menuApi from '@api/system/menuApi';
import { AuthInstance } from '@modules/axios';
import preferencesApi from '@api/system/preferencesApi';
import { setMenuItem } from '@modules/redux/reducers/menu';
import useApi from '@modules/hooks/useApi';

function MenuModal({ alertOpen, setAlertOpen, getMenuList, listReset, upperMenuList, configVal }) {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  menuApi.axios = instance;
  preferencesApi.axios = instance;

  // 액션실행 Hook
  const dispatch = useDispatch();
  const { selectedTopMenu } = useSelector((state) => state.menu);

  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      menuDivision: 'left',
      menuName: '',
      menuUrl: '',
      iconName: '',
      useYn: '',
      adminYn: '',
      roleCodeList: [],
      subUrlRegex: '',
      processUrlRegex: '',
    },
  });
  // 메뉴 구분 값 와쳐.
  const menuDivisionWatch = methods.watch('menuDivision');
  // select 박스 비활성화 상태값
  const [isSelect, setIsSelect] = useState({
    depth0: false,
    depth1: false,
    depth2: false,
    depth3: false,
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
    if (alertOpen) {
      // Form 객체 초기화
      methods.reset();
      // select 박스 초기화
      setIsSelect({ depth1: false, depth2: false });
    }
    // Clean-up
    return () => {
      source.cancel();
    };
  }, [alertOpen]);

  // 라디오 버튼, select 박스 값 변경 이벤트
  const handleChange = ({ value, name, type }) => {
    if (type === 'select') {
      const fieldNameArr = ['depth0', 'depth1', 'depth2', 'depth3'];
      const flag = value === '' ? false : true;
      let temp = isSelect;

      fieldNameArr.map((fieldName) => {
        if (fieldName !== name) {
          temp[`${fieldName}`] = flag;
        }
      });

      setIsSelect({ ...temp });
      return value;
    }
  };
  // 신규 데이터 저장
  const insertMenu = async (data) => {
    const { depth0, depth1, depth2, depth3, menuDivision } = data;
    let menuPid = '';
    let menuLevel = '';

    if (
      (depth0 === '' || depth0 === undefined) &&
      (depth1 === '' || depth1 === undefined) &&
      (depth2 === '' || depth2 === undefined) &&
      (depth3 === '' || depth3 === undefined)
    ) {
      // 상위메뉴 선택 안 했을 경우
      if (menuDivision === 'top') {
        menuPid = 0;
        menuLevel = 0;
      } else {
        menuPid = 0;
        menuLevel = 1;
      }
    } else {
      if (depth0 !== '') {
        // 0 Depth 상위 메뉴 선택 한 경우
        menuLevel = 1;
        menuPid = depth0;
      } else if (depth1 !== '') {
        // 1 Depth 상위 메뉴 선택 한 경우
        menuLevel = 2;
        menuPid = depth1;
      } else if (depth2 !== '') {
        // 2 Depth 상위 메뉴 선택 한 경우
        menuLevel = 3;
        menuPid = depth2;
      } else {
        // 3 Detph 상위 메뉴 선택 한 경우
        menuLevel = 4;
        menuPid = depth3;
      }
    }
    data.menuPid = menuPid;
    data.menuLevel = menuLevel;

    if (menuDivision === 'top') data.menuUrl = '/';
    const result = await apiCall(menuApi.insertMenu, data);
    if (result.status === 200) {
      const { count, menuId, menuPidList } = result.data;
      data.menuId = menuId;
      data.type = 'item';
      data.menuPidList = menuPidList;

      if (count === 1) {
        const menuResult = await apiCall(menuApi.getMenuList, {
          useYn: 'Y',
          isMenu: true,
          common: true,
          isEdit: true,
        });

        if (menuResult.status === 200) {

          dispatch(
            setMenuItem({
              topMenuItem: menuResult.data.menuList.map((menu) => ({
                label: menu.label,
                menuId: menu.menuId,
                children: menu.children,
              })),
              menuItem: menuResult.data.menuList.find(
                (topMenu) => topMenu.menuId === selectedTopMenu,
              )?.children,
            }),
          ),
            openModal({
              message: '메뉴가 등록되었습니다.',
              onConfirm: () => {
                setAlertOpen(false);
                getMenuList({ isEdit: true });
                listReset(data);
              },
            });
        }
      }
    }
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="md"
        fullWidth
        callBack={methods.handleSubmit(insertMenu)}
        alertOpen={alertOpen}
        closeAlert={setAlertOpen}
        title="메뉴 등록"
      >
        <FormProvider {...methods}>
          <form id="menuAddForm">
            <GridItem
              container
              divideColumn={1}
              borderFlag
              sx={{
                '& .text': { maxWidth: '200px', minWidth: '200px' },
                '.inputBox': { width: '200px' },
              }}
            >
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="메뉴구분"
                name="menuDivision"
                list={[
                  { label: '좌측 메뉴', value: 'left' },
                  { label: '상단 메뉴', value: 'top' },
                ]}
              />
              <LabelInput
                labelBackgroundFlag
                required
                maxLength={50}
                label="메뉴 명"
                name="menuName"
                placeholder="메뉴명"
              />
              {menuDivisionWatch === 'left' && (
                <GridItem container item divideColumn={1} borderFlag childtype="dom">
                  <LabelInput
                    labelBackgroundFlag
                    required
                    maxLength={100}
                    label="메뉴 URL"
                    name="menuUrl"
                    placeholder="메뉴 URL"
                  />
                  <LabelInput
                    labelBackgroundFlag
                    maxLength={100}
                    label="서브 메뉴 URL 정규 표현식"
                    name="subUrlRegex"
                    placeholder="정규 표현식"
                  />
                  <LabelInput
                    labelBackgroundFlag
                    maxLength={100}
                    label="요청 URL 정규 표현식"
                    name="processUrlRegex"
                    placeholder="정규 표현식"
                  />
                  <LabelInput
                    labelBackgroundFlag
                    type="select"
                    label="메뉴 아이콘"
                    name="iconName"
                    list={iconListGenerate()}
                  />
                </GridItem>
              )}

              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="사용여부"
                name="useYn"
                list={[
                  { label: '사용', value: 'Y' },
                  { label: '미사용', value: 'N' },
                ]}
              />
              <LabelInput
                required
                type="radio"
                labelBackgroundFlag
                label="관리자 전용"
                name="adminYn"
                list={[
                  { label: '전용', value: 'Y' },
                  { label: '미전용', value: 'N' },
                ]}
              />
              {menuDivisionWatch === 'left' && (
                <GridItem container item divideColumn={1} borderFlag childtype="dom">
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
                    <LabelInput
                      labelBackgroundFlag
                      type="select"
                      label="상위메뉴"
                      name="depth0"
                      list={upperMenuList.depth0}
                      onHandleChange={handleChange}
                      disabled={isSelect.depth0}
                    />
                    <LabelInput
                      labelBackgroundFlag
                      type="select"
                      name="depth1"
                      list={upperMenuList.depth1}
                      onHandleChange={handleChange}
                      disabled={isSelect.depth1}
                    />
                    {configVal > '2' && (
                      <LabelInput
                        labelBackgroundFlag
                        type="select"
                        name="depth2"
                        list={upperMenuList.depth2}
                        onHandleChange={handleChange}
                        disabled={isSelect.depth2}
                      />
                    )}
                    {configVal > '3' && (
                      <LabelInput
                        labelBackgroundFlag
                        type="select"
                        name="depth3"
                        list={upperMenuList.depth3}
                        onHandleChange={handleChange}
                        disabled={isSelect.depth3}
                      />
                    )}
                  </Stack>

                  <LabelInput
                    labelBackgroundFlag
                    type="checkbox"
                    label="롤 간편 등록"
                    name="roleCodeList"
                    helperText="※ 최하위 메뉴인 경우 적용됩니다."
                    helperTextProps={{ sx: { ml: 0 } }}
                    list={[
                      { label: '추가', value: '2' },
                      { label: '읽기', value: '1' },
                      { label: '수정', value: '3' },
                      { label: '삭제', value: '4' },
                    ]}
                  />
                </GridItem>
              )}
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
      {/* {console.log('메뉴추가 화면로딩... ')} */}
    </>
  );
}
export default MenuModal;
