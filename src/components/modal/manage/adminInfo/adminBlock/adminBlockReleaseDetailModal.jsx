// libraries
import { useState, useEffect, useCallback,useRef } from 'react';
import { useForm } from 'react-hook-form';
import { unstable_batchedUpdates } from 'react-dom';
import { Divider, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// components
import PopUp from '@components/modules/common/PopUp';
import Layout from '@components/layouts';
import AdminPasswordFailTable from '@components/manage/adminInfo/adminBlock/adminPasswordFailTable';
import AdminBlockReleaseForm from '@components/manage/adminInfo/adminBlock/adminBlockReleaseForm';
// functions
import { AuthInstance } from '@modules/axios';
import useApi from '@modules/hooks/useApi';
import HsLib from '@modules/common/HsLib';
import adminBlockHistoryApi from '@api/manage/adminInfo/adminBlockHistoryApi';
import { setModalParameters, setPasswordFailList } from '@modules/redux/reducers/adminBlock';

function AdminBlockReleaseDetailModal({
  alertOpen,
  setModalOpen,
  modalParams,
  getAdminBlockHistoryList,
}) {
  const { id, blockUserId, blockTime, blockType, releaseTime, releaseType, releaseUserName } =
    modalParams;

  const { instance, source } = AuthInstance();
  adminBlockHistoryApi.axios = instance;

  const [apiCall] = useApi();
  const dispatch = useDispatch();

  const parameterData = useSelector((state) => state.adminBlock);
  const current = parameterData.modalParameters.current;
  const { size, page } = parameterData.modalParameters.current;

  const methods = useForm({
    defaultValues: {
      blockUserId,
      blockType,
      blockTime: HsLib.changeDateFormat(blockTime, '$1-$2-$3 $4:$5:$6'),
      releaseUserName,
      releaseType,
      releaseTime: HsLib.changeDateFormat(releaseTime, '$1-$2-$3 $4:$5:$6'),
      releaseDesc: '-',
    },
  });
  const [columns, setColumns] = useState([]);
  const [gridInfo, setGridInfo] = useState({
    api: adminBlockHistoryApi,
    parameters: parameterData.parameters,
    listInfo: {},
    total: 0,
  });

  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('PwdFailHistory', adminBlockHistoryApi);
    unstable_batchedUpdates(() => {
      responseGridInfo(gridInfo);
    });
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
    getPasswordFailHistoryList(current);
  }, [size, page]);

  const responseGridInfo = (p_gridInfo) => {
    makeColumns(p_gridInfo.columns);
    setGridInfo((prev) => {
      return { ...prev, listInfo: p_gridInfo.listInfo };
    });
    // 검색조건 변경
    dispatch(
      setModalParameters({
        size: Number(p_gridInfo.listInfo.size),
      }),
    );
  };

  // TODO: 향후 관리자 차단 해지 기능 사용 시 관리자 차단 이력 조회하는 로직.
  const getPasswordFailHistoryList = async (parameters) => {
    // const { totalElements, content } = await apiCall(
    //   adminBlockHistoryApi.getPasswordFailHistoryList,
    //   parameters,
    // );
    // unstable_batchedUpdates(() => {
    //   setGridInfo((prev) => {
    //     return { ...prev, total: totalElements };
    //   });
    //   dispatch(setPasswordFailList(content));
    // });
  };

  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      switch (column.accessor) {
        case 'accResultNm':
          column.Cell = (props) => {
            return renderAccessResultCell(props, column);
          };
          break;
        default:
          break;
      }
      return column;
    });
    setColumns(gridColumns);
  };

  const renderAccessResultCell = useCallback(
    ({ value }) => (
      <Typography sx={{ color: value === '실패' ? 'red' : 'blue', fontWeight: 'bold' }}>
        {value}
      </Typography>
    ),
    [],
  );

  const handleSubmitButton = async () => {
    getAdminBlockHistoryList(parameterData.parameters.current);
  };

  return (
    <PopUp
      maxWidth="md"
      fullWidth
      callBack={methods.handleSubmit(handleSubmitButton)}
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      title="관리자 접속 차단 상세정보"
    >
      <Typography variant="h5" sx={{ my: 1 }}>
        비밀번호 실패 이력
      </Typography>
      <AdminPasswordFailTable columns={columns} gridInfo={gridInfo} setGridInfo={setGridInfo} />
      <Divider sx={{ borderStyle: 'dashed', borderBottomWidth: 2, my: 2 }} />
      <AdminBlockReleaseForm methods={methods} />
    </PopUp>
  );
}

AdminBlockReleaseDetailModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AdminBlockReleaseDetailModal;
