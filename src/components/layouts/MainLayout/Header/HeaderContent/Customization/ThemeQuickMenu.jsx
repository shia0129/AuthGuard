// material-ui
import { AddCircleOutlineOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { Button, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

// project imports
import SimpleBar from '@components/third-party/SimpleBar';
import { AuthInstance } from '@modules/axios';
import { useRouter } from 'next/router';
import { useEffect, useState,useRef } from 'react';
import useApi from '@modules/hooks/useApi';
import quickApi from '@api/system/quickApi';
import QuickMenuModal from '@components/modal/quick/QuickMenuModal';

const ThemeQuickMenu = ({ setOpen }) => {
  const { instance } = AuthInstance();
  quickApi.axios = instance;

  const router = useRouter();

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 바로가기 메뉴 목록
  const [quickMenuList, setQuickMenuList] = useState([]);

  // 바로가기 등록 모달 상태 값
  const [addAlertOpen, setAddAlertOpen] = useState(false);

  // 바로가기 메뉴 목록 조회
  const getQuickMenuList = async () => {
    const result = await quickApi.getQuickMenuList();
    setQuickMenuList(result.data);
  };

  // 바로가기 메뉴 삭제
  const deleteQuickMenu = async (deleteItem) => {
    const result = await apiCall(quickApi.deleteQuickMenu, deleteItem);
    if (result.status === 200) {
      setQuickMenuList((prev) => {
        return prev.filter((item) => item.menuId != deleteItem.menuId);
      });
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
    getQuickMenuList();
  }, []);

  return (
    <SimpleBar>
      <Button
        size="small"
        variant="dashed"
        color="secondary"
        startIcon={<AddCircleOutlineOutlined />}
        onClick={() => setAddAlertOpen(true)}
      >
        바로가기 메뉴 등록
      </Button>
      <List dense>
        {quickMenuList &&
          quickMenuList.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteQuickMenu(item)}>
                  <DeleteOutlineOutlined />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                onClick={() => {
                  setOpen((prev) => !prev);
                  router.push(item.menuUrl);
                }}
              >
                <ListItemText primary={item.menuName} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      {
        <QuickMenuModal
          alertOpen={addAlertOpen}
          setAlertOpen={setAddAlertOpen}
          getQuickMenuList={getQuickMenuList}
        />
      }
    </SimpleBar>
  );
};

export default ThemeQuickMenu;
