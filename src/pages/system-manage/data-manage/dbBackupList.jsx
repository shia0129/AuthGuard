// libraries
import { useState, useEffect, useRef } from 'react';
import { Replay } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { unstable_batchedUpdates } from 'react-dom';
import { FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';
// components
import Layout from '@components/layouts';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import ButtonSet from '@components/modules/button/ButtonSet';
import SearchInput from '@components/modules/input/SearchInput';
import ReactTable from '@components/modules/table/ReactTable';
// functions
import codeApi from '@api/system/codeApi';
import HsLib from '@modules/common/HsLib';
import { AuthInstance } from '@modules/axios';
import useInput from '@modules/hooks/useInput';
import commonApi from '@api/common/commonApi';
import useConfig from '@modules/hooks/useConfig';
import useApi from '@modules/hooks/useApi';
import usePopup from '@modules/hooks/usePopup';
import { isNull } from 'lodash';

const gridData_01 = {
  content: [
    {
      id: '1',
      workName: '사용자 정보이력 백업',
      tableName: 'tbl_user_info_his',
      workClassification: 'Backup',
    },
    {
      id: '2',
      workName: 'test',
      tableName: 'tbl_access_deny_his',
      workClassification: 'Backup',
    },
  ],
  pageable: {
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    unpaged: false,
    paged: true,
  },
  last: false,
  totalElements: 1,
  totalPages: 1,
  size: 10,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: true,
  numberOfElements: 10,
  empty: false,
};

function BranchList() {
  // Axios 인트턴스(Http통신)
  const { instance, source } = AuthInstance();
  codeApi.axios = instance;
  commonApi.axios = instance;
  // intl 객체(다국어)
  const intl = useIntl();
  // 검색조건 함수
  const [parameters, changeParameters, resetParameters, setParameters, unControlRef] = useInput({
    managerName: '',
    branchName: '',
  });
  // 작업 컬럼정보 상태값
  const [workColumns, setWorkColumns] = useState([]);
  // 작업 추가컬럼정보 상태값
  const [workAddColumns, setWorkAddColumn] = useState({});
  // 작업 테이블정보 상태값
  const [workGridInfo, setWorkGridInfo] = useState({
    api: codeApi,
    parameters: parameters,
    listInfo: {},
    total: 0,
  });
  // 작업 목록 상태값
  const [workList, setWorkList] = useState([]);
  // 작업 변경 목록 상태값
  const [workUpdateList, setWorkUpdateList] = useState([]);
  // 작업 삭제 목록 상태값
  const [workDeleteList, setWorkDeleteList] = useState([]);
  // api 호출 함수, openModal 함수
  const [apiCall, openModal] = useApi();
  // Locale 값(전역데이터 접근(Context Hook))
  const { i18n } = useConfig();
  // 팝업
  const handleOpenWindow = usePopup();
  // 작업주기 타입 상태값
  const [workCycleType, setWorkCycleType] = useState([]);
  // 선택된 Row의 id 저장
  const selectRow = useRef();
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: {
      workName: '',
      workSequence: '',
      workClassification: '',
      workCycle: '',
      backupPath: '',
      tableName: '',
      selectColumn: '',
      insertColumn: '',
    },
  });
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 초기화 함수
    init();
    // Clean-up
    return () => {
      source.cancel();
    };
  }, []);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    // 작업주기 타입 변경
    setWorkCycleType(methods.getValues('workCycle'));
  }, [methods.watch('workCycle')]);
  // 초기화 함수
  const init = async () => {
    // 테이블, 컬럼정보
    const branchGridInfo = await HsLib.getGridInfo('DbBackupList', codeApi);
    if (branchGridInfo) {
      // 작업 목록 요청
      // const dataList = await apiCall(codeApi.getList, {
      //   ...parameters,
      //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
      //   size: gridInfo.listInfo.size,
      // });
      const dataList = gridData_01;
      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 테이블, 컬럼정보 응답처리
        responseGridInfo(branchGridInfo);
        // 작업 목록 응답처리
        responseWorkList(dataList);
      });
    }
  };
  // 테이블, 컬럼정보 응답처리
  const responseGridInfo = (p_branchGridInfo) => {
    // 작업 컬럼/추가컬럼/테이블정보 상태값 변경
    setWorkColumns(p_branchGridInfo.columns);
    setWorkAddColumn(p_branchGridInfo.addColumn);
    setWorkGridInfo((prev) => {
      return { ...prev, listInfo: p_branchGridInfo.listInfo };
    });
    // 검색조건 변경
    setParameters({
      ...parameters,
      sort: `${p_branchGridInfo.listInfo.sortColumn ?? ''},${
        p_branchGridInfo.listInfo.sortDirection ?? ''
      }`,
      size: p_branchGridInfo.listInfo.size,
    });
  };
  // 작업 목록 응답처리
  const responseWorkList = (p_policyStatusList) => {
    // if (p_policyStatusList.status === 200) {
    setWorkDeleteList([]);
    setWorkGridInfo((prev) => {
      return { ...prev, total: p_policyStatusList.totalElements };
    });
    setWorkList(p_policyStatusList.content);
    setWorkUpdateList(p_policyStatusList.content);
    // }
  };
  // 작업 그리드 클릭 이벤트
  const handleWorkGridClick = async (event, cell, row) => {
    // 부서 목록 요청
    // const dataList = await apiCall(codeApi.getList, {
    //   ...parameters,
    //   sort: `${gridInfo.listInfo.sortColumn ?? ''},${gridInfo.listInfo.sortDirection ?? ''}`,
    //   size: gridInfo.listInfo.size,
    // });
    let detailData_01 = {};
    if (row.original.id === '1') {
      detailData_01 = {
        workName: '사용자 정보이력 백업',
        workSequence: '8',
        workClassification: '2',
        workCycle: '1',
        backupPath: '/hrx/data/sysbackup',
        tableName: '1',
        selectColumn:
          'user_seq, user_id, user_pass, user_name, dept_seq, user_position, user_rank, tel, cell, fax, use_status, user_type, part_owner, email, account_expires, ori_u_key, updytm, writer',
        insertColumn:
          'user_seq, user_id, user_pass, user_name, dept_seq, user_position, user_rank, tel, cell, fax, use_status, user_type, part_owner, email, account_expires, ori_u_key, updytm, writer',
      };
    } else {
      detailData_01 = {
        workName: 'test',
        workSequence: '9',
        workClassification: '2',
        workCycle: '2',
        backupPath: '/hrx/data/sysbackup/test',
        tableName: '2',
        selectColumn: 'test1,test2',
        insertColumn: 'test3,test4',
      };
    }
    for (const key in detailData_01) {
      if (!isNull(detailData_01[`${key}`])) {
        methods.setValue(key, detailData_01[`${key}`]);
      }
    }
  };
  // 작업 목록만 출력
  const getBranchList = async (parameters) => {
    // const result = await apiCall(codeApi.getList, parameters);
    // if (result.status === 200) {
    //   // 일괄 변경처리
    //   unstable_batchedUpdates(() => {
    //     if (!parameters) {
    //       resetParameters();
    //     }
    //     // 작업 목록 응답처리
    //     responseWorkList(result);
    //   });
    // }
  };
  // 작업 추가버튼 클릭 이벤트
  const handleBranchAddColumnButtonClick = () => {
    // 맨위로 컬럼 추가
    const column = { id: HsLib.getId(workList), ...workAddColumns };
    setWorkUpdateList([column, ...workList]);
    setWorkList([column, ...workList]);
  };
  // 작업 삭제버튼 클릭 이벤트
  const handleBranchDeleteButtonClick = () => {
    // if (deleteList.length !== 0) {
    //   openModal({
    //     message: `${deleteList.length}건을 삭제하시겠습니까?`,
    //     onConfirm: deleteBranchList,
    //   });
    // } else {
    //   openModal({
    //     message: `삭제할 컬럼을 우선 선택해 주십시오.`,
    //   });
    // }
  };
  // 리스트정보 삭제
  const deleteBranchList = async () => {
    // const result = await apiCall(
    //   tableListApi.deleteBranchList,
    //   deleteList.map((item) => item.id),
    // );
    // if (result.status === 200) {
    //   openModal({
    //     message: `${result.data}건이 삭제되었습니다.`,
    //     onConfirm: () => {
    //       getBranchList(parameters);
    //       setDeleteList([]);
    //     },
    //   });
    // }
  };
  // 작업 저장버튼 클릭 이벤트
  const handleBranchInsertButtonClick = async () => {
    // // Validation 체크
    // if (HsLib.checkValidity(updateList, columns, openModal)) return;
    // // 추가한 Row 리스트 (status: I)
    // const insertList = updateList.filter((obj) => obj.status === 'I');
    // // 중복 체크
    // const duplicationResult = await apiCall(tableListApi.duplicationTableList, insertList);
    // if (duplicationResult.status === 200 && duplicationResult.data === 'N') {
    //   openModal({
    //     message: '중복된 리스트 코드가 있습니다.',
    //   });
    // } else {
    //   const result = await apiCall(tableListApi.saveTableList, updateList);
    //   if (result.status === 200) {
    //     setDeleteList([]);
    //     getBranchList(parameters);
    //     openModal({
    //       message: '저장되었습니다.',
    //     });
    //   }
    // }
  };
  // 추가버튼 클릭 이벤트
  const handleAddButtonClick = () => {
    console.log('추가');
  };
  // 저장버튼 클릭 이벤트
  const handleInsertButtonClick = async (data) => {
    console.log('저장');
    console.log(data);
    if (moment.isMoment(data.dateTimeValue)) {
      data.dateTimeValue = data.dateTimeValue.format('YYYYMMDDHHmm');
    } else {
      data.dateTimeValue = HsLib.removeDateFormat(data.dateTimeValue) + '0000';
    }
  };
  // JSX
  return (
    <>
      <GridItem spacing={2} container direction="column">
        <SearchInput onSearch={() => getBranchList(parameters)}>
          <GridItem
            container
            divideColumn={4}
            spacing={2}
            sx={{
              pr: 5,
              '& .text': { maxWidth: '150px', minWidth: '150px' },
              '.inputBox': { maxWidth: '200px', minWidth: '200px' },
            }}
          >
            <LabelInput
              label="작업명"
              name="workName"
              inputProps={{ maxLength: 32 }}
              value={parameters.managerName}
              onChange={changeParameters}
            />
            <LabelInput
              label="테이블명"
              name="tableName"
              inputProps={{ maxLength: 32 }}
              value={parameters.branchName}
              onChange={changeParameters}
            />
          </GridItem>
        </SearchInput>

        <GridItem item directionHorizon="space-between">
          <ButtonSet type="custom" options={[]} />

          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                getBranchList();
              }}
            >
              <Replay />
            </Button>
            <ButtonSet
              type="search"
              options={[
                { label: intl.formatMessage({ id: 'btn-reset' }), callBack: resetParameters },
                {
                  label: intl.formatMessage({ id: 'btn-search' }),
                  callBack: () => getBranchList(parameters),
                },
              ]}
            />
          </Stack>
        </GridItem>

        <GridItem container item divideColumn={2} spacing={2}>
          <GridItem item direction="column">
            <Typography variant="h5">작업 목록</Typography>
            <ReactTable
              listFuncName="getBranchList"
              columns={workColumns}
              gridInfo={workGridInfo}
              setGridInfo={setWorkGridInfo}
              data={workList}
              setData={setWorkList}
              setUpdateData={setWorkUpdateList}
              checkList={workDeleteList}
              onChangeChecked={setWorkDeleteList}
              parameters={unControlRef}
              setParameters={setParameters}
              onClick={handleWorkGridClick}
              sx={{ mt: '7px' }}
            />
          </GridItem>
          <GridItem item direction="column">
            <Typography variant="h5">작업 상세 화면</Typography>
            <FormProvider {...methods}>
              <form id="menuListForm">
                <GridItem
                  container
                  direction="row"
                  divideColumn={1}
                  borderFlag
                  sx={{
                    mt: '7px',
                    '& .text': { maxWidth: '220px !important', minWidth: '220px !important' },
                    // '.inputBox': {
                    //   maxWidth: '310px',
                    //   minWidth: '310px',
                    // },
                    '.CMM-li-inputArea-select': {
                      maxWidth: '310px',
                      minWidth: '310px',
                    },
                    '.CMM-li-inputArea-textField': {
                      maxWidth: '310px',
                      minWidth: '310px',
                    },
                  }}
                >
                  <LabelInput
                    required
                    label="작업명"
                    name="workName"
                    inputProps={{ maxLength: 32 }}
                    placeholder=""
                    labelBackgroundFlag
                  />
                  <LabelInput
                    required
                    label="작업순서"
                    name="workSequence"
                    inputProps={{ maxLength: 32 }}
                    placeholder=""
                    labelBackgroundFlag
                  />
                  <LabelInput
                    type="select"
                    label="작업구분"
                    name="workClassification"
                    list={[
                      { value: '1', label: '삭제' },
                      { value: '2', label: 'Backup' },
                    ]}
                    placeholder=""
                    labelBackgroundFlag
                  />
                  <Stack direction="row" alignItems="center">
                    <LabelInput
                      required
                      type="select"
                      label="작업주기"
                      name="workCycle"
                      list={[
                        { value: '1', label: '분' },
                        { value: '2', label: '시' },
                        { value: '3', label: '일' },
                      ]}
                      placeholder=""
                      labelBackgroundFlag
                      sx={{ maxWidth: '100px !important', minWidth: '100px !important' }}
                    />
                    {workCycleType === '1' && (
                      <LabelInput
                        required
                        ampm={false}
                        type="time1"
                        name="dateTimeValue"
                        fullWidth
                        labelBackgroundFlag
                        views={['minutes']}
                        inputFormat="mm"
                      />
                    )}
                    {workCycleType === '2' && (
                      <LabelInput
                        required
                        ampm={false}
                        type="time1"
                        name="dateTimeValue"
                        fullWidth
                        labelBackgroundFlag
                        views={['hours', 'minutes']}
                        inputFormat="HH:mm"
                      />
                    )}
                    {workCycleType === '3' && (
                      <LabelInput
                        required
                        ampm={false}
                        type="dateTime"
                        name="dateTimeValue"
                        fullWidth
                        labelBackgroundFlag
                        views={['day', 'hours', 'minutes']}
                        inputFormat="DD HH:mm"
                      />
                    )}
                  </Stack>
                  <LabelInput
                    required
                    label="백업경로"
                    name="backupPath"
                    inputProps={{ maxLength: 32 }}
                    placeholder=""
                    labelBackgroundFlag
                  />
                  <LabelInput
                    required
                    type="select"
                    label="테이블명"
                    name="tableName"
                    list={[
                      { value: '1', label: 'tbl_user_info_his' },
                      { value: '2', label: 'tbl_access_deny_his' },
                      { value: '3', label: 'tbl_task_info' },
                      { value: '4', label: 'tbl_command_info' },
                      { value: '5', label: 'tbl_nss_system' },
                      { value: '6', label: 'tbl_svc_port' },
                      { value: '7', label: 'tbl_scan_directory' },
                      { value: '8', label: 'tbl_shared_volume' },
                      { value: '9', label: 'tbl_svc_method_conf' },
                    ]}
                    placeholder=""
                    labelBackgroundFlag
                  />
                  <LabelInput
                    required
                    requiredtype="textArea"
                    rows={5}
                    multiline
                    label="Select column"
                    name="selectColumn"
                    labelBackgroundFlag
                  />
                  <LabelInput
                    required
                    requiredtype="textArea"
                    rows={5}
                    multiline
                    label="Insert column"
                    name="insertColumn"
                    labelBackgroundFlag
                  />
                </GridItem>
              </form>
            </FormProvider>
            <GridItem item directionHorizon="end">
              <ButtonSet
                type="custom"
                options={[
                  {
                    label: '추가',
                    callBack: handleAddButtonClick,
                    variant: 'outlined',
                    color: 'secondary',
                    role: 'insert',
                  },
                  {
                    label: '저장',
                    callBack: methods.handleSubmit(handleInsertButtonClick),
                    variant: 'outlined',
                    color: 'secondary',
                  },
                ]}
                sx={{ mt: '17px' }}
              />
            </GridItem>
          </GridItem>
        </GridItem>
      </GridItem>
      {/* {console.log('DB백업/삭제 관리 화면로딩... ')} */}
    </>
  );
}

BranchList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default BranchList;
