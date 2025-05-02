// libraries
import { useCallback, useEffect, useState,useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';

import AdminBlockSearchForm from '@components/manage/adminInfo/adminBlock/adminBlockSearchForm';
import AdminBlockActionButton from '@components/manage/adminInfo/adminBlock/adminBlockActionButton';

// functions
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { setAdminBlockList, setComboData, setParameters } from '@modules/redux/reducers/adminBlock';
import AdminBlockTable from '@components/manage/adminInfo/adminBlock/adminBlockTable';
import adminBlockHistoryApi from '@api/manage/adminInfo/adminBlockHistoryApi';
import codeApi from '@api/system/codeApi';
import { Link } from '@mui/material';
import HsFileHandler from '@modules/common/HsFileHandler';
import AdminBlockReleaseDetailModal from '@components/modal/manage/adminInfo/adminBlock/adminBlockReleaseDetailModal';

function AdminBlockHistory() {
  const { instance, source } = AuthInstance();
  adminBlockHistoryApi.axios = instance;
  codeApi.axios = instance;

  const [apiCall, openModal] = useApi();

  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.adminBlock);
  const current = parameterData.parameters.current;
  const { size, page } = parameterData.parameters.current;

  const [gridInfo, setGridInfo] = useState({
    api: adminBlockHistoryApi,
    parameters: parameterData.parameters,
    listInfo: {},
    total: 0,
  });

  const [columns, setColumns] = useState([]);
  const [modalParams, setModalParams] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('AdminBlockHis', adminBlockHistoryApi);

    comboData('BLOCK_TYPE');
    comboData('RELEASE_TYPE');

    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
  };

  const comboData = async (codeType) => {
    const data = await HsLib.comboList(codeApi, codeType);

    dispatch(setComboData({ [codeType]: data }));
  };

  const responseGridInfo = (p_gridInfo) => {
    makeColumns(p_gridInfo.columns);
    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });
    dispatch(
      setParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };
  const getAdminBlockHistoryList = async (parameters) => {
    const { totalElements, content } = await apiCall(
      adminBlockHistoryApi.getAdminBlockHistoryList,
      parameters,
    );
    unstable_batchedUpdates(() => {
      setGridInfo((prev) => {
        return { ...prev, total: totalElements };
      });

      dispatch(setAdminBlockList(content));
    });
  };

  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'blockUserId':
          column.Cell = (props) => {
            return reunderAdminIdCell(props);
          };
          break;
        default:
          break;
      }
      return column;
    });

    setColumns(gridColumns);
  };

  const handleEditButtonClick = (adminInfo) => {
    setModalParams({ ...adminInfo });
    setModalOpen(true);
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
    getAdminBlockHistoryList(current);
  }, [size, page]);

  const handleExcelButtonClick = async () => {
    const result = await apiCall(adminBlockHistoryApi.getAdminBlockExcelList, current);

    const { isSuccess, message } = HsFileHandler.saveAsExcel(result);

    if (!isSuccess) {
      openModal({
        message,
        type: 'error',
      });
    }
  };

  const reunderAdminIdCell = useCallback(({ row: { original } }) => {
    return (
      <Link
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          height: 1,
          width: 1,
        }}
        onClick={() => handleEditButtonClick(original)}
      >
        {original.blockUserId}
      </Link>
    );
  }, []);

  return (
    <>
      <GridItem spacing={2} container direction="column">
        <AdminBlockSearchForm />
        <AdminBlockActionButton
          onSearchButtonClick={getAdminBlockHistoryList}
          onExcelButtonClick={handleExcelButtonClick}
        />
        <AdminBlockTable columns={columns} gridInfo={gridInfo} setGridInfo={setGridInfo} />
      </GridItem>
      {modalOpen && (
        <AdminBlockReleaseDetailModal
          alertOpen={modalOpen}
          setModalOpen={setModalOpen}
          modalParams={modalParams}
          getAdminBlockHistoryList={getAdminBlockHistoryList}
        />
      )}
    </>
  );
}

AdminBlockHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AdminBlockHistory;
