import { useCallback, useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import GridItem from '@components/modules/grid/GridItem';

import Layout from '@components/layouts';
import { AuthInstance } from '@modules/axios';
import {
  setColumns,
  setDeleteList,
  setListInfo,
  setPageDataList,
  setParameters,
  setZoneNameList,
} from '@modules/redux/reducers/hss/sslvpn/user';
import useApi from '@modules/hooks/useApi';

import userApi from '@api/hss/sslvpn/userApi';
import UserSearchForm from '@components/hss/sslvpn/user/userSearchForm';
import UserActionButton from '@components/hss/sslvpn/user/userActionButton';
import UserTable from '@components/hss/sslvpn/user/userTable';
import HsLib from '@modules/common/HsLib';
import zoneApi from '@api/hss/sslvpn/zoneApi';

function UserManage() {
  const { instance, source } = AuthInstance();

  userApi.axios = instance;
  zoneApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.user);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('UserManage', userApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });

    getZoneNameList();
  };

  const responseGridInfo = (p_gridInfo) => {
    dispatch(setColumns(p_gridInfo.columns));
    dispatch(setListInfo(p_gridInfo.listInfo));
    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  const getUserList = async (param) => {
    const { totalElements, content } = await apiCall(userApi.getUserList, param);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleDeleteButtonClick = async () => {
    if (parameterData.deleteList.length !== 0) {
      const result = await apiCall(
        userApi.deleteUserData,
        parameterData.deleteList.map((item) => item.id),
      );

      if (result) {
        openModal({
          message: result,
          onConfirm: () => {
            getUserList({ ...parameterData.parameters.current, page: 0 });
            dispatch(setParameters({ page: 0 }));
            dispatch(setDeleteList([]));
          },
        });
      }
    } else {
      openModal({
        message: `삭제할 항목을 먼저 선택해주세요.`,
      });
    }
  };

  const getZoneNameList = useCallback(async () => {
    const data = await apiCall(zoneApi.getZoneColumnList, 'name');
    if (data) {
      const list = data.map((item) => ({
        value: item,
        label: item,
      }));
      dispatch(setZoneNameList(list));
    }
  }, []);

  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    
    init();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getUserList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <UserSearchForm />
      <UserActionButton
        onSearchButtonClick={getUserList}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
      <UserTable getUserList={getUserList} />
    </GridItem>
  );
}

UserManage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default UserManage;
