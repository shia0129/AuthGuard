// libraries
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState ,useRef} from 'react';
// components
import PopUp from '@components/modules/common/PopUp';
import MainCard from '@components/mantis/MainCard';
import TreeList from '@components/mantis/tree/TreeList';
import TreeListItem from '@components/mantis/tree/TreeListItem';
import GridItem from '@components/modules/grid/GridItem';
import QuickMenuItem from './QuickMenuItem';

// functions
import { AuthInstance } from '@modules/axios';
import menuApi from '@api/system/menuApi';
import quickApi from '@api/system/quickApi';
import useApi from '@modules/hooks/useApi';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

function QuickMenuModal({ alertOpen, setAlertOpen, getQuickMenuList: getThemeQuickMenuList }) {
  // theme 객체(테마)
  const theme = useTheme();
  // Axios 인트턴스(Http통신)
  const { instance } = AuthInstance();
  menuApi.axios = instance;
  quickApi.axios = instance;
  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();
  // 메뉴 목록 상태값
  const [menuList, setMenuList] = useState([{ key: 'root', title: '', children: [] }]);
  // 선택한 메뉴 순서 상태값
  const [selectMenuOrder, setSelectMenuOrder] = useState([]);
  // 선택한 메뉴 목록 상태값
  const [selectMenuList, setSelectMenuList] = useState([]);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 메뉴 목록 출력
    getMenuList();
    getQuickMenuList();
  }, [alertOpen]);
  // 메뉴 목록 출력
  const getMenuList = useCallback(async () => {
    const result = await apiCall(menuApi.getMenuList, { isMenu: false, useYn: 'Y' });

    if (result.status === 200) {
      setMenuList((initData) => {
        const tempArray = [...initData];
        tempArray[0].children = result.data.menuList;
        return tempArray;
      });
    }
  }, []);
  // 등록된 바로가기 메뉴 목록 출력
  const getQuickMenuList = async () => {
    const result = await apiCall(quickApi.getQuickMenuList);

    if (result.status === 200) {
      let newMenuList = [];
      let newItemOrder = [];

      for (let menu of result.data) {
        const { menuId, menuName } = menu;
        const newMenu = { id: menuId.toString(), title: menuName };
        newMenuList.push(newMenu);
        newItemOrder.push(menuId.toString());
      }

      setSelectMenuList(newMenuList);
      setSelectMenuOrder(newItemOrder);
    }
  };
  // 메뉴 더블 클릭 이벤트
  const onDoubleclick = (menuList) => {
    const { menuId, menuName, children } = menuList;
    // 최하위 메뉴만 선택 가능
    if (!children || children?.length === 0) {
      if (!selectMenuOrder.includes(menuId.toString())) {
        const newMenu = { id: menuId.toString(), title: menuName };
        setSelectMenuList((prev) => [...prev, newMenu]);
        setSelectMenuOrder((prev) => [...prev, menuId.toString()]);
      }
    }
  };
  // Drag 끝났을 때 호출 이벤트
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    // 리스트 밖으로 drop 됐을 경우
    if (!destination) return;
    // 출발지와 도착지가 같을 경우
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const newOrder = Array.from(selectMenuOrder);
    newOrder.splice(source.index, 1);
    newOrder.splice(destination?.index, 0, draggableId);
    setSelectMenuOrder(newOrder);
  };
  // 바로가기메뉴 저장
  const insertQuickMenu = async () => {
    const result = await apiCall(quickApi.insertQuickMenu, selectMenuOrder);

    if (result.status === 200) {
      openModal({
        message: `수정되었습니다.`,
        onConfirm: () => {
          getThemeQuickMenuList();
          setAlertOpen(false);
        },
      });
    }
  };
  // 선택된 바로가기메뉴 삭제
  const handleDelete = (index) => {
    const newOrder = Array.from(selectMenuOrder);
    newOrder.splice(index, 1);
    setSelectMenuOrder(newOrder);
  };
  // 메뉴 그리는 함수
  const childMenuDraw = (menuList = []) =>
    menuList.map((menuList) => {
      return (
        // 대메뉴넣고 해당되는 하위메뉴 넣기
        <TreeListItem
          key={menuList.id}
          nodeId={menuList.id.toString()}
          label={menuList.title}
          onDoubleClick={() => onDoubleclick(menuList)}
        >
          {childMenuDraw(menuList.children)}
        </TreeListItem>
      );
    });
  // column drop wrapper style
  const getDropWrapper = (isDraggingOver, theme, radius) => {
    const bgcolor =
      theme.palette.mode === 'dark'
        ? theme.palette.background.default
        : theme.palette.background.paper;
    const bgcolorDrop =
      theme.palette.mode === 'dark'
        ? theme.palette.text.disabled
        : theme.palette.background.paper + 99;

    return {
      background: isDraggingOver ? bgcolorDrop : bgcolor,
      padding: '8px 16px 8px',
      width: 'auto',
      borderRadius: radius,
    };
  };
  // JSX
  return (
    <PopUp
      maxWidth="sm"
      fullWidth
      callBack={insertQuickMenu}
      alertOpen={alertOpen}
      closeAlert={setAlertOpen}
      title="바로가기 메뉴"
      sx={{ zIndex: 2005 }}
    >
      <GridItem container item divideColumn={2}>
        <MainCard border={false}>
          <TreeList sx={{ height: 400, overflowY: 'auto' }}>
            {menuList.map((menuData) => childMenuDraw(menuData.children))}
          </TreeList>
        </MainCard>
        <MainCard border={false}>
          <MainCard sx={{ flexGrow: 1 }}>
            <Box sx={{ height: 400, overflowY: 'auto' }}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="columns" type="item">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={getDropWrapper(snapshot.isDraggingOver, theme, `4px`)}
                    >
                      {selectMenuOrder &&
                        selectMenuOrder.map((itemId, index) => {
                          const item = selectMenuList.filter((item) => item.id === itemId)[0];
                          return (
                            <QuickMenuItem
                              key={index}
                              item={item}
                              index={index}
                              handleDelete={handleDelete}
                            />
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </MainCard>
        </MainCard>
      </GridItem>
    </PopUp>
  );
}
export default QuickMenuModal;
