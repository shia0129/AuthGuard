// libraries
import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import AdminManageSearchForm from '@components/manage/adminInfo/adminManage/adminManageSearchForm';
import AdminManageActionButton from '@components/manage/adminInfo/adminManage/adminManageActionButton';
import AdminManageTable from '@components/manage/adminInfo/adminManage/adminManageTable';

// functions
import commonApi from '@api/common/commonApi';
import adminApi from '@api/system/adminApi';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAdminPermissionParamList,
  setColumns,
  setListInfo,
  setPageDataList,
  setParameters,
} from '@modules/redux/reducers/adminManage';

function AdminManagePopup() {
  const { instance, source } = AuthInstance();
  adminApi.axios = instance;
  commonApi.axios = instance;
  const [apiCall] = useApi();

  const dispatch = useDispatch();
  const parameterData = useSelector((state) => state.adminManage);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('AdminListPopup', adminApi);

    const adminPermissionList = await apiCall(adminApi.getAdminPermissionList);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);

      responseAdminPermissionList(adminPermissionList);
    });
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
    return () => source.cancel();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    getAdminList(parameterData.parameters.current);
  }, [size, page]);

  const responseAdminPermissionList = (p_adminPermissionList) => {
    let permissionData = [];
    if (p_adminPermissionList.status === 200) {
      p_adminPermissionList.data.map((data) => {
        permissionData = [...permissionData, { label: data.userPermissionName, value: data.id }];
      });
      dispatch(setAdminPermissionParamList(permissionData));
    }
  };

  const getAdminList = async (parameters) => {
    const {
      data: { totalElements, content },
    } = await apiCall(adminApi.getAdminList, parameters);

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleSendData = (adminInfo) => {
    if ('setAdminInfo' in opener) opener.setAdminInfo(adminInfo);

    window.close();
  };

  return (
    <GridItem container direction="column" spacing={2}>
      <AdminManageSearchForm />
      <AdminManageActionButton onSearchButtonClick={getAdminList} />
      <AdminManageTable onUserNameClick={handleSendData} />
    </GridItem>
  );
}

AdminManagePopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="popup" title="관리자 선택">
      {page}
    </Layout>
  );
};

export default AdminManagePopup;
