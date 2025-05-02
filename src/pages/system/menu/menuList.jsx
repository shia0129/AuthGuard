// libraries
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import MainCard from '@components/mantis/MainCard';
import TreeList from '@components/mantis/tree/TreeList';
import TreeListItem from '@components/mantis/tree/TreeListItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import ConfirmPop from '@components/modules/popover/ConfirmPop';
import { iconListGenerate } from '@modules/common/menuParser';
import MenuModal from '@components/modal/system/menu/menuModal';
import MenuSettingModal from '@components/modal/system/menu/menuSettingModal';
// functions
import menuApi from '@api/system/menuApi';
import preferencesApi from '@api/system/preferencesApi';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import { setMenuItem } from '@modules/redux/reducers/menu';
import { openSnackbar } from '@modules/redux/reducers/snackbar';
//import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

// Scrollbar Style
const Scrollbar = styled(OverlayScrollbarsComponent)({
  height: '100%',
  '& .os-scrollbar-vertical .os-scrollbar-track .os-scrollbar-handle': {
    minHeight: '30px',
    maxHeight: '30px',
  },
});

function MenuList() {
  const theme = useTheme();
  const { instance, source } = AuthInstance();
  menuApi.axios = instance;
  preferencesApi.axios = instance;

  const dispatch = useDispatch();
  const [apiCall, openModal, apiAllCall] = useApi();

  const methods = useForm({
    defaultValues: {
      useYn: '',
      adminYn: '',
      useSubCheck: [],
      adminSubCheck: [],
      menuName: '',
      subUrlRegex: '',
      processUrlRegex: '',
      depth1: '',
      depth2: '',
    },
  });

  const {
    selectedTopMenu,
    menuItem: { topItems },
  } = useSelector((state) => state.menu);

  const isTopMenu = useRef(false);
  const hasFetched = useRef(false); // 첫 번째 렌더링 시 중복 요청 방지

  const [menuList, setMenuList] = useState([
    { key: 'root', menuId: 'root', id: 'root', title: 'HSCK SECURE GATE', children: [] },
  ]);
  const [commonRegexFlag, setCommonRegexFlag] = useState(false);
  const [contentClick, setContentClick] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [useYnVal, setUseYnVal] = useState('');
  const [adminUseYnVal, setAdminUseYnVal] = useState('');
  const [popTarget, setPopTarget] = useState(null);
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [settingAlertOpen, setSettingAlertOpen] = useState(false);
  const [configVal, setConfigVal] = useState('');
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(['root', selectedTopMenu ? selectedTopMenu : null]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const menuRequest = apiCall(menuApi.getMenuList, { isMenu: false });
        const upperMenuRequest = apiCall(menuApi.getUpperMenuList);
        const preferenceRequest = apiCall(preferencesApi.getPreferences, {
          configType: 'MENU',
          hasToken: false,
        });

        const [menuResult, upperMenuResult, preferenceResult] = await apiAllCall([
          menuRequest,
          upperMenuRequest,
          preferenceRequest,
        ]);

        unstable_batchedUpdates(() => {
          if (menuResult?.status === 200) {
            setMenuList((initData) => {
              const tempArray = [...initData];
              tempArray[0].children = menuResult.data.menuList;
              return tempArray;
            });
          }

          if (preferenceResult?.status === 200) {
            const { configValue } = preferenceResult.data.find(
              (config) => config.configName === 'menuDepth',
            );
            setConfigVal(configValue);
          }
        });
      } catch (error) {
        console.error('메뉴 목록을 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();

    return () => {
      source.cancel();
    };
  }, []);

  const getMenuList = useCallback(async () => {
    try {
      const menuResult = await apiCall(menuApi.getMenuList, { useYn: 'Y', isMenu: true });

      if (menuResult?.status === 200) {
        dispatch(
          setMenuItem({
            topMenuItem: menuResult.data.menuList.map((menu) => ({
              label: menu.label,
              menuId: menu.menuId,
              children: menu.children,
            })),
          }),
        );
      }
    } catch (error) {
      console.error('메뉴 데이터를 가져오는 중 오류 발생:', error);
    }
  }, []);

  return (
    <GridItem container item divideColumn={12} spacing={2}>
      <MainCard
        title="메뉴 설정"
        colSpan={3}
        sx={{ height: 'calc(100vh - 200px)' }}
        contentSX={{ height: 'calc(100vh - 240px)', pb: '15px', overflow: 'hidden' }}
      >
        <Scrollbar>
          <TreeList expanded={expanded} selected={selected}>
            {menuList.map((menu) => (
              <TreeListItem key={menu.id} nodeId={menu.id.toString()} label={menu.title}>
                {menu.children?.map((child) => (
                  <TreeListItem key={child.id} nodeId={child.id.toString()} label={child.title} />
                ))}
              </TreeListItem>
            ))}
          </TreeList>
        </Scrollbar>
      </MainCard>

      <MainCard title="상세정보" colSpan={9}>
        <FormProvider {...methods}>
          <form id="menuListForm">
            <GridItem container direction="row" divideColumn={1} borderFlag>
              <LabelInput label="메뉴 명" name="menuName" required placeholder="메뉴명을 입력하세요" />
              <LabelInput label="메뉴 URL" name="menuUrl" required placeholder="메뉴 URL을 입력하세요" />
              <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
                <LabelInput label="요청 URL 정규표현식" name="processUrlRegex" placeholder="정규 표현식 입력" />
              </Stack>
            </GridItem>
          </form>
        </FormProvider>
      </MainCard>
    </GridItem>
  );
}

MenuList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default MenuList;
