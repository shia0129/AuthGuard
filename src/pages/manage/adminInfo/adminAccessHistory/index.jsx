import { useEffect,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import AdminAccessSearchForm from '@components/manage/adminInfo/adminAccess/adminAccessSearchForm';
import AdminAccessActionButton from '@components/manage/adminInfo/adminAccess/adminAccessActionButton';
import AdminAccessTable from '@components/manage/adminInfo/adminAccess/adminAccessTable';
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import {
  setParameters,
  setListInfo,
  setPageDataList,
  setColumns,
} from '@modules/redux/reducers/adminAccess';
import adminAccessHistoryApi from '@api/manage/adminInfo/adminAccessHistoryApi';
import HsFileHandler from '@modules/common/HsFileHandler';

function AdminAccessHistry() {
  const { instance, source } = AuthInstance();

  adminAccessHistoryApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.adminAccess);
  const { size, page } = parameterData.parameters.current;

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('AdminAccessHis', adminAccessHistoryApi);

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
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

  const getAdminAccessList = async (param) => {
    const { totalElements, content } = await apiCall(
      adminAccessHistoryApi.getAdminAccessHistoryList,
      param,
    );

    dispatch(setPageDataList({ pageDataList: content, totalElements }));
  };

  const handleExcelButtonClick = async () => {
    const result = await apiCall(
      adminAccessHistoryApi.getAdminAccessExcelList,
      parameterData.parameters.current,
    );

    const { isSuccess, message } = HsFileHandler.saveAsExcel(result);

    if (!isSuccess) {
      openModal({
        message,
        type: 'error',
      });
    }
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
    getAdminAccessList(parameterData.parameters.current);
  }, [size, page]);

  return (
    <GridItem spacing={2} container direction="column">
      <AdminAccessSearchForm />
      <AdminAccessActionButton
        onSearchButtonClick={getAdminAccessList}
        onExcelButtonClick={handleExcelButtonClick}
      />
      <AdminAccessTable />
    </GridItem>
  );
}

AdminAccessHistry.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AdminAccessHistry;
