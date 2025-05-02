import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

// next
import { useRouter } from 'next/router';

// types
import Loader from '@components/mantis/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuItem, setMenuRoleList, setSelectedTopMenu } from '@modules/redux/reducers/menu';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import menuApi from '@api/system/menuApi';
import adminApi from '@api/system/adminApi';
import codeApi from '@api/system/codeApi';
import { setAllCodeList } from '@modules/redux/reducers/code';

const checkMenu = (menuList, currentPath, menuRef) => {
  return menuList.find((menu) => {
    if (menu.type !== 'item' && menu.children.length !== 0) {
      return checkMenu(menu.children, currentPath, menuRef);
    } else if (menu.type === 'item') {
      const urlList = menu.url.split('/').filter((url) => url);
      const sameEl = menu.url.split('/').filter((url) => url && currentPath.split('/').includes(url));

      let urlMatch = false;
      if (sameEl.length >= urlList.length - 1) {
        let preUrl = '/';
        for (let i = 0; i < urlList.length - 1; i++) {
          preUrl += `${urlList[i]}/`;
        }
        let regexp = new RegExp(`^${preUrl}${menu.subUrlRegex}$`, 'gi');
        urlMatch = regexp.test(currentPath);
      }
      if (urlMatch) {
        menuRef.current = menu;
        return menu;
      }
    }
  });
};

const checkPmenu = (list = [], target) => {
  let pMenuId = '';
  for (let i = 0; i < list.length; i++) {
    const menu = list[i];

    if (target === menu.menuId) {
      return menu;
    } else if (menu.children.length !== 0) {
      const result = checkPmenu(menu.children, target);
      if (result) {
        if (menu.type !== 'group' || menu.type !== 'item') {
          pMenuId = menu.menuId;
        }
      }
    }
  }
  return pMenuId;
};

const PermissionGuard = ({ children, auth }) => {
  const dispatch = useDispatch();
  const { selectedTopMenu } = useSelector((state) => state.menu);
  const { data: session, update: sessionUpdate } = useSession();
  const router = useRouter();
  const menuRef = useRef(null);
  //const isMountedRef = useRef(false);

  const [isPermit, setIsPermit] = useState(true);
  const [menuList, setMenuList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { flag } = router.query;

  // API 호출 함수
  const [apiCall, openModal] = useApi();

  const { instance } = AuthInstance();
  menuApi.axios = instance;
  adminApi.axios = instance;
  codeApi.axios = instance;

  let currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }

    const getMenuList = async () => {
      try {
        const menuRequest = apiCall(menuApi.getMenuList, { useYn: 'Y', isMenu: true, common: true});
        const roleRequest = apiCall(adminApi.getUserRoleList, { userSeq: session?.user?.userSeq, common: true });
        const [menuResult, roleResult] = await Promise.all([menuRequest, roleRequest]);

        if (menuResult.status === 200) {
          if (menuResult.data?.firstDisplayMenu && session.user.firstPage !== menuResult.data.firstDisplayMenu) {
            sessionUpdate({ firstPage: menuResult.data.firstDisplayMenu });
          }

          let pMenuId = checkPmenu(menuResult.data.menuList, menuResult.data.firstMenuPid);
          if (!selectedTopMenu) dispatch(setSelectedTopMenu({ selectedTopMenu: pMenuId }));

          setMenuList(menuResult.data.menuList);
        }

        if (roleResult.status === 200) {
          setRoleList(roleResult.data);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('메뉴 목록 로딩 중 오류:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (session) getMenuList();

    return () => {
      //controller.abort();
    };
  }, [session]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }

    const checkPermission = () => {
      if (menuList.length !== 0 && !auth && roleList.length !== 0) {
        menuRef.current = null;
        const topMenu = checkMenu(menuList, currentPath, menuRef);

        const menuRoleList = roleList
          .filter((role) => role?.includes(menuRef.current?.menuCode))
          .map((role) => role?.slice(-1));

        if (
          menuRef.current &&
          topMenu &&
          (flag
            ? (flag === 'insert' && menuRoleList.includes('2')) ||
              (flag === 'update' && menuRoleList.includes('3'))
            : true)
        ) {
          setIsPermit(true);
          dispatch(setMenuRoleList({ menuRoleList }));
          dispatch(setSelectedTopMenu({ selectedTopMenu: topMenu.menuId }));
          dispatch(
            setMenuItem({
              menuItem: topMenu.children,
              topMenuItem: menuList.map((menu) => ({
                label: menu.label,
                menuId: menu.menuId,
                children: menu.children,
              })),
            }),
          );
        } else {
          openModal({
            message: '접근 권한이 없습니다.',
            type: 'error',
            onConfirm: () => router.push(session?.user?.firstPage || '/'),
          });
          setIsPermit(false);
        }
      }
    };

    if (session) checkPermission();
  }, [menuList, roleList, currentPath]);


  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0003.current){
        useEffect_0003.current = true;
        return; 
      } 
    }
    const getAllCodeList = async () => {
      try {
        const result = await apiCall(codeApi.getTotalCodeList);
        dispatch(setAllCodeList(result));
      } catch (error) {
        console.error("코드 목록 로딩 중 오류:", error);
      }
    };
    getAllCodeList();
  }, []);

  if (loading) return <Loader />;
  return isPermit || auth ? children : <Loader />;
};

PermissionGuard.propTypes = {
  children: PropTypes.node,
};

export default PermissionGuard;
