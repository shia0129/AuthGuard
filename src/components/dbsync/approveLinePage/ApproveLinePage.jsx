import { Grid, Typography, Stack } from '@mui/material';
import MainCard from '@components/mantis/MainCard';
import { AuthInstance } from '@modules/axios';
import dbsyncApi from '@api/system/dbsyncApi';
import { useEffect, useState,useRef } from 'react';
import useApi from '@modules/hooks/useApi';
import { useIntl } from 'react-intl';
import HsLib from '@modules/common/HsLib';
import ReactTable from '@components/modules/table/ReactTable';
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import useInput from '@modules/hooks/useInput';
import ApproveLineResultTable from './ApproveLineResultTable';

/**
 * ApproveLinePage 정의
 *
 * 결재선 정책 화면
 *
 * @param {String} connectionSeq 선택된 연결방식 seq
 * @param {Function} handleChangePage 보여줄 페이지 설정
 *
 *
 */
function ApproveLinePage({ connectionSeq, handleChangePage }) {
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;

  //checkbox에서 체크된 row 리스트 상태값
  const [deleteList, setDeleteList] = useState([]);

  //변경된 row 리스트 상태값
  const [updateList, setUpdateList] = useState([]);

  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // intl 객체(다국어)
  const intl = useIntl();

  //결재선 정책 리스트 상태값
  const [apprLinePolicyList, setApprLineList] = useState([]);
  // 그리드 정보
  const [gridInfo, setGridInfo] = useState({
    api: dbsyncApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  //사용하지 않지만 ReactTable 변수로 넘겨주기 위해서 생성
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});

  // 컬럼 정보
  const [columns, setColumns] = useState([]);
  // 추가 컬럼 정보
  const [addColumn, setAddColumn] = useState({});

  //결재선정책 insert,update
  const updateApprLinePolicy = async () => {
    // Validation 체크
    if (HsLib.checkValidity(updateList, columns, openModal)) return;
    // 추가한 Row 리스트 (status: I)
    const insertList = updateList.filter((obj) => obj.status === 'I');

    //신규 결재자 정책 insert
    let result = await apiCall(
      dbsyncApi.postApprLinePolicy,
      insertList.map((e) => {
        return {
          policyCode: e.policyCode,
          approveId: e.approveId,
          requesterType: e.requesterType,
          approveType: e.approveType,
          approveOrder: e.approveOrder,
          manualParameter: e.manualParameter,
          privacyYn: e.privacyYn,
          deleteYn: 'N',
          connectionSeq: connectionSeq,
        };
      }),
    );

    if (result.status != 200) {
      openModal({
        message: '신규 결재선 정책 저장을 실패했습니다.',
      });
      return;
    }

    // 추가한 Row 리스트 (status: I)
    const updatedList = updateList.filter((obj) => obj.status === 'U');

    //신규 결재자 정책 insert
    result = await apiCall(
      dbsyncApi.putApprLinePolicy,
      updatedList.map((e) => {
        return {
          policySeq: e.policySeq,
          policyCode: e.policyCode,
          approveId: e.approveId,
          requesterType: e.requesterType,
          approveType: e.approveType,
          approveOrder: e.approveOrder,
          manualParameter: e.manualParameter,
          privacyYn: e.privacyYn,
          deleteYn: 'N',
          connectionSeq: connectionSeq,
        };
      }),
    );

    if (result.status != 200) {
      openModal({
        message: '결재선 정책 수정을 실패했습니다.',
      });
      return;
    } else {
      setDeleteList([]);
      getApprLinePolicy();
      openModal({
        message: '저장되었습니다.',
      });
    }
  };

  //결재선정책 조회
  const getApprLinePolicy = async () => {
    const result = await apiCall(dbsyncApi.getApprLinePolicy, {
      connectionSeq,
    });

    if (result.status === 200) {
      setDeleteList([]);
      setGridInfo((prev) => {
        return { ...prev, total: result.data.totalElements };
      });
      setApprLineList(
        result.data.map((e, index) => {
          return { ...e, id: index };
        }),
      );
      setUpdateList(
        result.data.map((e, index) => {
          return { ...e, id: index };
        }),
      );
    }
  };

  //결재선 정책 삭제
  const deleteApprLinePolicy = async () => {
    const result = await apiCall(
      dbsyncApi.deleteApprLinePolicy,
      deleteList.map((item) => item.policySeq),
    );

    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          getApprLinePolicy();
          setDeleteList([]);
        },
      });
    } else {
      openModal({
        message: '결재선정책 삭제에 실패했습니다.',
        onConfirm: () => {},
      });
    }
  };

  //결재선 삭제버튼 클릭시 호출
  const handleDeleteButton = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteApprLinePolicy,
      });
    } else {
      openModal({
        message: `삭제할 컬럼을 우선 선택해 주십시오.`,
      });
    }
  };

  //최초 렌더링시 초기화함수
  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DbsyncApprLine', dbsyncApi);

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

      await getApprLinePolicy();
    }
  };

  //신규 입력row 추가
  const handleAddColumnButtonClick = () => {
    // 맨위로 컬럼 추가
    const column = { id: HsLib.getId(apprLinePolicyList), ...addColumn };
    setUpdateList([column, ...apprLinePolicyList]);
    setApprLineList([column, ...apprLinePolicyList]);
  };
  const useEffect_0001 = useRef(false);
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
  return (
    <>
      <GridItem container directionHorizon="center" directionVertical="center" px={2} pb={2}>
        <Stack direction="row" sx={{ width: '300px', justifyContent: 'space-between' }}>
          <ButtonSet
            options={[
              {
                label: intl.formatMessage({ id: 'btn-back' }),
                callBack: () => {
                  handleChangePage((value) => value - 1);
                },
                variant: 'outlined',
                color: 'secondary',
              },
            ]}
          />
          <Typography variant="h4" mr={13}>
            결재선 정책
          </Typography>
        </Stack>
      </GridItem>

      <MainCard
        title={
          <GridItem item directionHorizon="space-between">
            <ButtonSet
              type="custom"
              options={[
                {
                  label: intl.formatMessage({ id: 'btn-save' }),
                  callBack: updateApprLinePolicy,
                  // variant: 'outlined',
                  // role: 'insert',
                  color: 'primary',
                },
                {
                  label: intl.formatMessage({ id: 'btn-delete' }),
                  callBack: handleDeleteButton,
                  color: 'secondary',
                  // variant: 'outlined',
                  // role: 'delete',
                },
              ]}
            />
            <ButtonSet
              type="custom"
              options={[
                {
                  label: intl.formatMessage({ id: 'btn-add' }),
                  callBack: handleAddColumnButtonClick,
                  // callBack: handleInsertButtonClick,
                  variant: 'outlined',
                  // role: 'insert',
                },
                {
                  label: intl.formatMessage({ id: 'btn-view' }),
                  callBack: getApprLinePolicy,
                  variant: 'outlined',
                  // role: 'insert',
                },
              ]}
            />
          </GridItem>
        }
      >
        <GridItem container divideColumn={1} rowSpacing={2}>
          <ReactTable
            columns={columns}
            data={apprLinePolicyList}
            setData={setApprLineList}
            checkList={deleteList}
            onChangeChecked={setDeleteList}
            setUpdateData={setUpdateList}
            gridInfo={gridInfo}
            setGridInfo={setGridInfo}
            setParameters={setParameters}
            parameters={unControlRef}
          />
        </GridItem>

        <ApproveLineResultTable connectionSeq={connectionSeq} />
      </MainCard>
    </>
  );
}

export default ApproveLinePage;
