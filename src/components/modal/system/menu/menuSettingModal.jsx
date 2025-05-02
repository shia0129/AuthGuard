// libraries
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// components
import GridItem from '@components/modules/grid/GridItem';
import PopUp from '@components/modules/common/PopUp';
import LabelInput from '@components/modules/input/LabelInput';
// functions
import { setMenuItem, setTopMenuUseYn } from '@modules/redux/reducers/menu';
import menuApi from '@api/system/menuApi';
import preferencesApi from '@api/system/preferencesApi';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';

function MenuSettingModal({ alertOpen, setAlertOpen, getMenuList, listReset }) {

  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  menuApi.axios = instance;
  preferencesApi.axios = instance;
  // 액션실행 Hook
  const dispatch = useDispatch();
  const { selectedTopMenu } = useSelector((state) => state.menu);

  // Form 객체
  const methods = useForm();
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // 메뉴설정(메뉴구조,최상위메뉴) 상태값
  const [preferenceList, setPreferenceList] = useState([]);
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
      // 메뉴 설정값 출력
      getMenuConfig();
    }
    // Clean-up
    return () => {
      source.cancel();
    };
  }, [alertOpen]);
  // 메뉴 설정값 출력
  const getMenuConfig = async () => {
    const result = await apiCall(preferencesApi.getPreferences, {
      configType: 'MENU',
      hasToken: false,
    });

    if (result.status === 200) {
      result.data.map((preference) =>
        methods.setValue(preference.configName, preference.configValue),
      );
      setPreferenceList(result.data);
    }
  };
  // 변경 데이터 저장
  const updateMenuConfig = async (data) => {
    const parameters = {};
    const preferencesList = [];

    for (let configName in data) {
      const preference = preferenceList.find((preference) => preference.configName === configName);

      preferencesList.push({
        configId: preference.configId,
        configName: preference.configName,
        configValue: data[`${configName}`],
      });
    }

    parameters.preferencesList = preferencesList;

    const result = await apiCall(menuApi.updateMenu, parameters);

    if (result.status === 200) {
      const menuResult = await apiCall(menuApi.getMenuList, {
        useYn: 'Y',
        isMenu: true,
        common: true,
      });
      if (menuResult.status === 200)
        dispatch(
          setMenuItem({
            topMenuItem: menuResult.data.menuList.map((menu) => ({
              label: menu.label,
              menuId: menu.menuId,
              children: menu.children,
            })),
            menuItem: menuResult.data.menuList.find((topMenu) => topMenu.menuId === selectedTopMenu)
              .children,
          }),
        );
      const config = preferencesList.find((config) => config.configName === 'topMenuUseYn');

      dispatch(setTopMenuUseYn({ topMenuUseYn: config.configValue }));
      openModal({
        message: '수정되었습니다.',
        onConfirm: () => {
          setAlertOpen(false);
          getMenuList();
          listReset();
        },
      });
    }
  };
  // JSX
  return (
    <PopUp
      maxWidth="xs"
      fullWidth
      callBack={methods.handleSubmit(updateMenuConfig)}
      alertOpen={alertOpen}
      closeAlert={setAlertOpen}
      title="메뉴 설정"
    >
      <FormProvider {...methods}>
        <form id="menuSettingModal">
          <GridItem
            container
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '150px', minWidth: '150px' },
            }}
          >
            <LabelInput
              required
              labelBackgroundFlag
              label="메뉴 구조"
              type="radio"
              name="menuDepth"
              list={[
                { label: '2단', value: '2' },
                { label: '3단', value: '3' },
                { label: '4단', value: '4' },
              ]}
            />
            <LabelInput
              required
              labelBackgroundFlag
              label="최상위 메뉴"
              type="radio"
              name="topMenuUseYn"
              list={[
                { label: '사용', value: 'Y' },
                { label: '미사용', value: 'N' },
              ]}
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}
export default MenuSettingModal;
