import { useRef } from 'react';
import HsLib from '@modules/common/HsLib';
import useApi from './useApi';
//import userApi from '@api/manage/userApi';
import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { setPopupRoleList } from '@modules/redux/reducers/menu';

function usePopup(authUrl) {
  // const [popupMap, setPopupMap] = useState({});
  const { data: session } = useSession();
  const [apiCall] = useApi();
  const menuRoleList = useSelector((state) => state.menu.menuRoleList);
  const menuList = useSelector((state) => state.menu.menuItem);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  const checkMenu = (menuList, currentPath, menuRef) => {
    return menuList.find((menu) => {
      const urlList = menu.url.split('/').filter((url) => url);
      const sameEl = menu.url
        .split('/')
        .filter((url) => url && currentPath.split('/').includes(url));
      if (menu.type !== 'item' && menu.children.length !== 0) {
        checkMenu(menu.children, currentPath, menuRef);
      } else if (menu.type === 'item') {
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
        }
      }
    });
  };

  // const fetchAccessInfo = async () => {
  //   const roleResult = await apiCall(userApi.getUserRoleList, {
  //     userSeq: session.user.userSeq,
  //     common: true,
  //   });

  //   if (roleResult.status === 200) {
  //     checkMenu(menuList.items, authUrl, menuRef);

  //     const popupRoleList = roleResult.data
  //       .filter((role) => role.indexOf(menuRef.current?.menuCode) !== -1)
  //       .map((role) => role.slice(-1));

  //     return popupRoleList;
  //   }
  // };

  const handleOpenWindow = async ({
    url,
    openName,
    width,
    height,
    dataSet = null,
    fullscreen = false,
  }) => {
    // const popupAccess = authUrl ? await fetchAccessInfo() : menuRoleList;
    // dispatch(setPopupRoleList({ popupRoleList: { [openName]: popupAccess } }));

    const popup = HsLib.openPopup(url, openName, width, height);
    if (fullscreen) {
      popup.moveTo(0, 0);
      popup.resizeTo(screen.availWidth, screen.availHeight);
    }
    if (dataSet) {
      for (const data in dataSet) {
        window[`${data}`] = dataSet[`${data}`];
      }
    }

    // const closeInterval = setInterval(() => {
    //   if (popup.closed) {
    //     clearInterval(closeInterval);
    //     const _popupRoleList = { ...popupRoleList };
    //     delete _popupRoleList[`${openName}`];

    //     dispatch(setPopupRoleList({ popupRoleList: _popupRoleList }));
    //   }
    // }, 1000);

    // popup.addEventListener('unload', function (event) {
    //   if (!confirm('정말 팝업창을 닫으시겠습니까?')) {
    //     event.returnValue = false;
    //   }
    // });

    // setPopupMap((prev) => ({
    //   ...prev,
    //   [openName]: popup,
    // }));
  };

  return handleOpenWindow;
}

export default usePopup;
