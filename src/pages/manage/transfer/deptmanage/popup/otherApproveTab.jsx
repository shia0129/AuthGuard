import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Tooltip, Typography } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/styles';
import { PlayCircle } from '@mui/icons-material';
import ButtonSet from '@components/modules/button/ButtonSet';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import adminApi from '@api/system/adminApi';
import deptListApi from '@api/system/deptListApi';
import ReactTable from '@components/modules/table/ReactTable';
import useInput from '@modules/hooks/useInput';

const cardTitleStyled = {
  height: '50px',
};

const initInfos = {
  userId: '',
  userName: 'test123',
  startUseDate: '',
  endUseDate: '',
  userPermissionId: '',
  deleteYn: '',
};

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }}>
    <div>{props.children}</div>
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

function OtherApproveTab({ value, index }) {
  // 컬럼 정보
  const [columns, setColumns] = useState([]);

  // 겸직자 목록.
  const [approveList, setApproveList] = useState([]);
  const [updateList, setUpdateList] = useState([]);
  // 추가 컬럼 정보
  const [addColumn, setAddColumn] = useState({});

  // 삭제 목록.
  const [deleteList, setDeleteList] = useState([]);

  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: deptListApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  // 검색.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    deptSeq: '',
  });

  const theme = useTheme();

  const { instance } = AuthInstance();
  deptListApi.axios = instance;

  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();

  const openConfirmModal = useConfirmModal();

  const methods = useForm({
    defaultValues: initInfos,
  });
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 팝업 사이즈 조절
    HsLib.windowResize(1290, 565);

    init();
  }, []);

  const init = async () => {
    // 테이블 정보 가져오기
    // Parameter( ListCode, api)
    const gridInfo = await HsLib.getGridInfo('ApproveList', deptListApi);

    makeColumns(gridInfo.columns);

    if (gridInfo) {
      setColumns(gridInfo.columns);
      setAddColumn(gridInfo.addColumn);
      setGridInfo((prev) => {
        return { ...prev, listInfo: gridInfo.listInfo };
      });
      setParameters({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
      await getApproveList({
        ...parameters,
        sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
        size: gridInfo.listInfo.size,
      });
    }
  };

  // cell customizing
  const makeColumns = (columns) => {
    const gridColumns = columns.map((column) => {
      return column;
    });

    setColumns(gridColumns);
  };

  const handleSaveDialogOpen = () => {
    openConfirmModal({
      message: '부서 정보를 수정하시겠습니까?',
      target: 'deptInfo',
      methods,
    });
  };

  const doSave = async (data) => {
    if (moment.isMoment(data.startUseDate)) {
      // 날짜 수정했을경우
      data.startUseDate = data.startUseDate.format('YYYYMMDD000000');
    } else {
      data.startUseDate = HsLib.removeDateFormat(data.startUseDate) + '000000';
    }

    if (moment.isMoment(data.endUseDate)) {
      // 날짜 수정했을경우
      data.endUseDate = data.endUseDate.format('YYYYMMDD000000');
    } else {
      data.endUseDate = HsLib.removeDateFormat(data.endUseDate) + '000000';
    }

    data.id = opener.userSeq;

    const result = await apiCall(adminApi.updateAdminList, data);
    let message;
    if (result.status === 200) {
      if (result.data > 0) {
        message = '수정되었습니다.';
      } else {
        message = '수정에 실패하였습니다.';
      }
      openModal({
        message,
        onConfirm: () => {
          opener.getAdminList();
          window.close();
        },
      });
    }
  };

  // row 추가
  const handleAddColumnButtonClick = () => {
    // 맨위로 컬럼 추가
    const column = { id: HsLib.getId(approveList), ...addColumn };
    setUpdateList([column, ...approveList]);
    setApproveList([column, ...approveList]);
  };

  // 삭제
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteApproveList,
      });
    } else {
      openModal({
        message: `삭제할 컬럼을 우선 선택해 주십시오.`,
      });
    }
  };

  // 테이블 삭제
  const deleteApproveList = async () => {
    const result = await apiCall(
      deptListApi.deleteApproveList,
      deleteList.map((item) => item.id),
    );

    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          getApproveList();
          setDeleteList([]);
        },
      });
    }
  };

  //테이블 조회
  const getApproveList = async () => {
    const result = await apiCall(deptListApi.getCurrentList, opener.deptSeq);

    if (result.status === 200) {
      // result.data 핸들링
      setApproveList(result.data.content);
      setDeleteList([]);
      setGridInfo((prev) => {
        return { ...prev, total: result.data.totalElements };
      });
      setUpdateList(result.data.content);
    }
  };

  return (
    <div hidden={index != value}>
      <FormProvider {...methods}>
        <form id="otherApprove" onSubmit={methods.handleSubmit(doSave)}>
          <GridItem container direction="column" sx={{ px: 2, pt: 3 }} spacing={2}>
            <GridItem item>
              <MainCard
                overflowVisible
                title={
                  <GridItem
                    container
                    directionHorizon="space-between"
                    sx={{ alignItems: 'baseline' }}
                  >
                    <Typography variant="h5">
                      <PlayCircle
                        sx={{
                          fontSize: '1.2em',
                          color: theme.palette.primary.main,
                          verticalAlign: 'middle',
                        }}
                      />{' '}
                      겸직자관리
                    </Typography>

                    <ButtonSet
                      type="custom"
                      options={[
                        {
                          label: '추가',
                          callBack: handleAddColumnButtonClick,
                          variant: 'outlined',
                          color: 'secondary',
                          // 임시
                          // role: 'insert',
                        },
                        {
                          label: '삭제',
                          callBack: handleDeleteButtonClick,
                          variant: 'outlined',
                          color: 'secondary',
                          // 임시
                          // role: 'delete',
                        },
                        {
                          label: '저장',
                          color: 'primary',
                          callBack: handleSaveDialogOpen,
                        },
                        {
                          label: '닫기',
                          color: 'secondary',
                          callBack: () => {
                            if (window.history.length < 2) {
                              window.close();
                            } else {
                              window.history.back();
                            }
                          },
                        },
                      ]}
                    />
                  </GridItem>
                }
                headerSX={cardTitleStyled}
              />
              <GridItem item>
                <ReactTable
                  listFuncName="getApproveList"
                  columns={columns}
                  data={approveList}
                  checkList={deleteList}
                  onChangeChecked={setDeleteList}
                  setData={setApproveList}
                  setUpdateData={setUpdateList}
                  gridInfo={gridInfo}
                  setGridInfo={setGridInfo}
                  setParameters={setParameters}
                  parameters={unControlRef}
                />
              </GridItem>
            </GridItem>
          </GridItem>
        </form>
      </FormProvider>
    </div>
  );
}

export default OtherApproveTab;
