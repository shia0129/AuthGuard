import { Grid, Typography, Stack } from '@mui/material';
import MainCard from '@components/mantis/MainCard';
import ApproverPolicyResultTable from './ApproverPolicyResultTable';
import GridItem from '@components/modules/grid/GridItem';
import { useEffect } from 'react';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { AuthInstance } from '@modules/axios';
import dbsyncApi from '@api/system/dbsyncApi';
import { useState,useRef } from 'react';
import { useIntl } from 'react-intl';
import useInput from '@modules/hooks/useInput';
import ButtonSet from '@components/modules/button/ButtonSet';
import ReactTable from '@components/modules/table/ReactTable';

/**
 * ApproverPolicyPage 정의
 *
 * 결재자정책 화면
 *
 * @param {String} connectionSeq 연결방식 seq
 * @param {Function} handleChangePage 보여줄 페이지 번호 지정
 *
 *
 */
function ApproverPolicyPage({ connectionSeq, handleChangePage }) {
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  const { instance, source } = AuthInstance();
  dbsyncApi.axios = instance;

  //결재자정책 상태값
  const [apprPolicyList, setApprPolicyList] = useState([]);
  //체크된 결재자정책 row 상태값
  const [deleteList, setDeleteList] = useState([]);

  // 추가 컬럼 정보
  const [addColumn, setAddColumn] = useState({});
  //수정된 결재자정책 상태값
  const [updateList, setUpdateList] = useState([]);
  // intl 객체(다국어)
  const intl = useIntl();

  //결재자정책 테이블 그리드정보
  const [gridInfo, setGridInfo] = useState({
    api: dbsyncApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });

  //결재자정책 테이블 cell 정보
  const [columns, setColumns] = useState([]);

  //실제로 사용하지 않지만 ReactTable 필수값으로 전달해주어야해서 생성함.
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({});

  //최초 렌더링시 초기화 함수
  const init = async () => {
    const gridInfo = await HsLib.getGridInfo('DbsyncApprPolicy', dbsyncApi);

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
      await getApprPolicy();
    }
  };

  //'추가'버튼 클릭시, 신규 row 추가
  const handleAddColumnButtonClick = () => {
    // 맨위로 컬럼 추가
    const column = { id: HsLib.getId(apprPolicyList), ...addColumn, approveSeq: '' };
    setUpdateList([column, ...apprPolicyList]);
    setApprPolicyList([column, ...apprPolicyList]);
  };

  //결재자정책 조회
  const getApprPolicy = async () => {
    const result = await apiCall(dbsyncApi.getApprPolicy, {
      connectionSeq,
    });

    if (result.status === 200) {
      setDeleteList([]);
      setGridInfo((prev) => {
        return { ...prev, total: result.data.totalElements };
      });

      //결재자정책은 ID(approveId) 또는 직위(approveRank) 한가지만 입력 가능
      setApprPolicyList(
        result.data.map((e, index) => {
          return {
            ...e,
            id: index,
            policyType: e.approveId ? 'ID' : '직위',
            approveData: e.approveId ? e.approveId : e.approveRank,
          };
        }),
      );
      setUpdateList(
        result.data.map((e, index) => {
          return {
            ...e,
            id: index,
            policyType: e.approveId ? 'ID' : '직위',
            approveData: e.approveId ? e.approveId : e.approveRank,
          };
        }),
      );
    }
  };

  //결재자정책 삭제
  const deleteApprLine = async () => {
    const result = await apiCall(
      dbsyncApi.deleteApprLine,
      deleteList.map((item) => item.approveSeq),
    );

    if (result.status === 200) {
      openModal({
        message: `${result.data}건이 삭제되었습니다.`,
        onConfirm: () => {
          getApprPolicy();
          setDeleteList([]);
        },
      });
    } else {
      openModal({
        message: '결재자정책 삭제를 실패했습니다.',
        onConfirm: () => {},
      });
    }
  };

  //결재자정책 insert, update
  const insertAndUpdateApprPolicy = async () => {
    // Validation 체크
    if (HsLib.checkValidity(updateList, columns, openModal)) return;

    // 추가한 Row 리스트 (status: I)
    const insertList = updateList.filter((obj) => obj.status === 'I');

    //신규 결재자 정책 insert
    let result = await apiCall(
      dbsyncApi.postApprPolicy,
      insertList.map((e) => {
        return {
          approveId: e.policyType == 'ID' ? e.approveData : '',
          approveRank: e.policyType == '직위' ? e.approveData : '',
          approveGrade: e.approveGrade,
          privacyYn: e.privacyYn,
          deleteYn: 'N',
          connectionSeq: connectionSeq,
        };
      }),
    );

    if (result.status != 200) {
      openModal({
        message: '신규 결재자 정책 저장을 실패했습니다.',
      });
      return;
    }

    // 추가한 Row 리스트 (status: U)
    const updatedList = updateList.filter((obj) => obj.status === 'U');

    //기존 결재자 정책 update
    result = await apiCall(
      dbsyncApi.putApprPolicy,
      updatedList.map((e) => {
        return {
          approveSeq: e.approveSeq,
          approveId: e.policyType == 'ID' ? e.approveData : '',
          approveRank: e.policyType == '직위' ? e.approveData : '',
          approveGrade: e.approveGrade,
          privacyYn: e.privacyYn,
          deleteYn: 'N',
          connectionSeq: connectionSeq,
        };
      }),
    );

    if (result.status != 200) {
      openModal({
        message: '결재자 정책 수정을 실패했습니다.',
      });
      return;
    } else {
      setDeleteList([]);
      getApprPolicy();
      openModal({
        message: '저장되었습니다.',
      });
    }
  };
  //'삭제'버튼 클릭시, 결재자정책 버튼 삭제
  const handleDeleteButtonClick = () => {
    if (deleteList.length !== 0) {
      openModal({
        message: `${deleteList.length}건을 삭제하시겠습니까?`,
        onConfirm: deleteApprLine,
      });
    } else {
      openModal({
        message: `삭제할 컬럼을 우선 선택해 주십시오.`,
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
    init();
    return () => source.cancel();
  }, []);

  return (
    <>
      <GridItem container directionHorizon="center" directionVertical="center" px={2} pb={2}>
        <Stack direction="row" sx={{ width: '300px', justifyContent: 'space-between' }}>
          <ButtonSet
            type="custom"
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
          <Typography variant="h4">결재자 정책</Typography>
          <ButtonSet
            type="custom"
            options={[
              {
                label: intl.formatMessage({ id: 'btn-next' }),
                callBack: () => {
                  handleChangePage((value) => value + 1);
                },
                variant: 'outlined',
                color: 'secondary',
              },
            ]}
          />
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
                  callBack: insertAndUpdateApprPolicy,
                  // variant: 'outlined',
                  color: 'primary',
                },
                {
                  label: intl.formatMessage({ id: 'btn-delete' }),
                  callBack: handleDeleteButtonClick,
                  // variant: 'outlined',
                  color: 'secondary',
                },
              ]}
            />
            <ButtonSet
              type="custom"
              options={[
                {
                  label: intl.formatMessage({ id: 'btn-add' }),
                  callBack: handleAddColumnButtonClick,
                  variant: 'outlined',
                  color: 'secondary',
                },
                {
                  label: intl.formatMessage({ id: 'btn-view' }),
                  callBack: getApprPolicy,
                  variant: 'outlined',
                  color: 'secondary',
                },
              ]}
            />
          </GridItem>
        }
      >
        <ReactTable
          columns={columns}
          data={apprPolicyList}
          setData={setApprPolicyList}
          checkList={deleteList}
          onChangeChecked={setDeleteList}
          gridInfo={gridInfo}
          setUpdateData={setUpdateList}
          setGridInfo={setGridInfo}
          setParameters={setParameters}
          parameters={unControlRef}
        />
      </MainCard>
    </>
  );
}

export default ApproverPolicyPage;
