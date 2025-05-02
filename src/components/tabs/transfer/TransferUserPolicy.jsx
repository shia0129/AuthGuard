import { useState, useEffect ,useRef} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

// Project import
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import { Button, Stack, FormHelperText, Typography, InputLabel, Box } from '@mui/material';
import { AuthInstance } from '@modules/axios';
import Label from '@components/modules/label/Label';
import useApi from '@modules/hooks/useApi';
import codeApi from '@api/system/codeApi';
import policyApi from '@api/transfer/policyApi';
import transferUserApi from '@api/transfer/transferUserApi';
import deptListApi from '@api/system/deptListApi';
import CheckBoxInput from './WeekCheckBox';

import { unstable_batchedUpdates } from 'react-dom';

function TransferUserPolicy({
  userSeq,
  policyCd,
  changePolicyCd,
  userDeptFlag,
  getTransferUserList,
}) {
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: initInfos,
  });

  const { id } = userSeq;

  const newPolicyCd = methods.watch('policyCd');

  const initInfos = {
    policyType: 'S',
    policyCd: '',
    policyName: '',
    urlType: '',
    policyFlag: '',
    limitCount: '',
    limitSize: '',
    dayLimitCount: '',
    dayLimitSize: '',
    limitDownloadCount: '',
    limitCountExternal: '',
    limitSizeExternal: '',
    dayLimitCountExternal: '',
    dayLimitSizeExternal: '',
    limitDownloadCountExternal: '',
    clipboardPolicyFlag: '',
    clipboardLimitSize: '',
    clipboardDayLimitCount: '',
    clipboardDayLimitSize: '',
    clipboardBackupFlag: '',
    approveUseType: '',
    approveUseTypeExternal: '',
    afterApprove: '',
    insideUseYn: false,
    afterApproveExternal: '',
    outsideUseYn: false,
    clipboardHistoryFlag: '',
    originFileSaveYn: '',
    fileFilter: '',
    fileFilterType: '',
    fileFilterExternal: '',
    fileFilterTypeExternal: '',
  };

  const { instance, source } = AuthInstance();
  const theme = useTheme();

  policyApi.axios = instance;
  codeApi.axios = instance;
  transferUserApi.axios = instance;
  deptListApi.axios = instance;

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  const [afterApproveState, setInsideApproveLimitState] = useState('');

  const [afterApproveExternalState, setOutsideApproveLimitState] = useState('');

  const [weekValue, setWeekValue] = useState();
  const [weekValueExternal, setWeekValueExternal] = useState();
  const [selectTimeList, setSelectTimeList] = useState([]);

  const [policyList, setPolicyList] = useState([]);
  const [viewPolicyList, setViewPolicyList] = useState([]);

  const [enabledFlag, setEnabledFlag] = useState({
    insideUseFlag: false,
    outsideUseFlag: false,
  });

  const init = async () => {
    // changePolicyCd(newPolicyCd);

    const policyList = await apiCall(policyApi.getPolicyList);

    unstable_batchedUpdates(() => {
      setPolicyList(policyList.data.content);
    });
  };

  const getPolicyInfo = async () => {
    if (Object.keys(policyCd).length !== 0 && policyCd.policyCd !== -1) {
      const userPolicyInfo = await apiCall(policyApi.getPolicyList, policyCd);

      const selectTime = await apiCall(codeApi.getComboInfo, 'BATCH_HOUR_TYPE');

      // 일괄 변경처리
      unstable_batchedUpdates(() => {
        // 역할목록 응답처리
        responseTransferUser(userPolicyInfo);
        responseSelectTime(selectTime);
      });
    }
  };

  // 관리자목록 응답처리
  const responseTransferUser = (p_transferUser) => {
    if (p_transferUser.status === 200) {
      Object.keys(initInfos).forEach((key) => {
        if (key === 'policyCd') {
          methods.setValue(key, p_transferUser.data.content[0][`id`]);
          return;
        } else if (key === 'afterApprove') {
          const afterApproveValue = p_transferUser.data.content[0].afterApprove.split('/');
          methods.setValue(key, afterApproveValue[0]);
          setInsideApproveLimitState(afterApproveValue[0]);
          if (afterApproveValue[0] === '1') {
            setWeekValue(afterApproveValue[1]);
          }
          if (afterApproveValue[2] === 'all' || afterApproveValue[2] === 'none') {
            methods.setValue('insideUseYn', false);
          } else {
            if (afterApproveValue[0] !== '2') {
              methods.setValue('insideUseYn', true);
              const afterApproveTime = afterApproveValue[2].split('~');
              if (afterApproveTime[0].includes('!')) {
                methods.setValue('insideSelectTimeInclude', 'selectTimeExclude');
                let firstTime = afterApproveTime[0].replace('!', '');
                methods.setValue('insideStartHour', firstTime);
                methods.setValue('insideEndHour', afterApproveTime[1]);
              } else {
                methods.setValue('insideStartHour', afterApproveTime[0]);
                methods.setValue('insideEndHour', afterApproveTime[1]);
                methods.setValue('insideSelectTimeInclude', 'selectTimeInclude');
              }
            }
          }
          return;
        } else if (key === 'afterApproveExternal') {
          const afterApproveExternalValue =
            p_transferUser.data.content[0].afterApproveExternal.split('/');
          methods.setValue(key, afterApproveExternalValue[0]);
          setOutsideApproveLimitState(afterApproveExternalValue[0]);
          if (afterApproveExternalValue[0] === '1') {
            setWeekValueExternal(afterApproveExternalValue[1]);
          }
          if (afterApproveExternalValue[2] === 'all' || afterApproveExternalValue[2] === 'none') {
            methods.setValue('outsideUseYn', false);
          } else {
            if (afterApproveExternalValue[0] !== '2') {
              methods.setValue('outsideUseYn', true);
              const afterApproveExternalTime = afterApproveExternalValue[2].split('~');
              if (afterApproveExternalTime[0].includes('!')) {
                methods.setValue('outsideSelectTimeInclude', 'selectTimeExclude');
                let firstTime = afterApproveExternalTime[0].replace('!', '');
                methods.setValue('outsideStartHour', firstTime);
                methods.setValue('outsideEndHour', afterApproveExternalTime[1]);
              } else {
                methods.setValue('outsideStartHour', afterApproveExternalTime[0]);
                methods.setValue('outsideEndHour', afterApproveExternalTime[1]);
                methods.setValue('outsideSelectTimeInclude', 'selectTimeInclude');
              }
            }
          }
          return;
        }
        methods.setValue(key, p_transferUser.data.content[0][`${key}`]);
      });
    }
  };

  const responseSelectTime = (p_selectTime) => {
    let comboData = [];

    if (p_selectTime.status === 200) {
      p_selectTime.data.resultData.map((data) => {
        comboData = [...comboData, { value: data.codeValue, label: data.codeDesc }];
      });
      setSelectTimeList(comboData);
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

    return () => source.cancel();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    if (id === 1) {
      return () => source.cancel();
    }
    if (policyCd.policyCd === -1) {
      clearForm();
      return () => source.cancel();
    }

    getPolicyInfo();

    return () => source.cancel();
  }, [policyCd]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0003.current){
        useEffect_0003.current = true;
        return; 
      } 
    }
    changePolicyCd(newPolicyCd);
  }, [newPolicyCd]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0004.current){
        useEffect_0004.current = true;
        return; 
      } 
    }
    changePolicyCdList(methods.getValues('policyType'));
  }, [methods.watch('policyType')]);

  const clearForm = () => {
    Object.keys(initInfos).forEach((key) => {
      methods.setValue(key, '');
    });
  };

  const policyDetailChange = ({ value }) => {
    policyList.forEach((data) => {
      if (value === data.id) {
        policyDetailMapping(data);
      }
    });
    return value;
  };

  const changePolicyCdList = (value) => {
    setViewPolicyList([]);
    const tempPolicyList = [];
    policyList.forEach((data) => {
      if (data.policyType === value) {
        tempPolicyList.push({ label: data.id, value: data.id });
      }
    });
    setViewPolicyList(tempPolicyList);
  };

  const policyDetailMapping = (p_policyDetail) => {
    Object.keys(initInfos).forEach((key) => {
      if (key === 'policyCd') {
        methods.setValue(key, p_policyDetail[`id`]);
        return;
      } else if (key === 'afterApprove') {
        const afterApproveValue = p_policyDetail.afterApprove.split('/');
        methods.setValue(key, afterApproveValue[0]);
        setInsideApproveLimitState(afterApproveValue[0]);
        if (afterApproveValue[0] === '1') {
          setWeekValue(afterApproveValue[1]);
        }
        if (afterApproveValue[2] === 'all' || afterApproveValue[2] === 'none') {
          methods.setValue('insideUseYn', false);
        } else {
          methods.setValue('insideUseYn', true);
          const afterApproveTime = afterApproveValue[2].split('~');
          if (afterApproveTime[0].includes('!')) {
            methods.setValue('insideSelectTimeInclude', 'selectTimeExclude');
            let firstTime = afterApproveTime[0].replace('!', '');
            methods.setValue('insideStartHour', firstTime);
            methods.setValue('insideEndHour', afterApproveTime[1]);
          } else {
            methods.setValue('insideStartHour', afterApproveTime[0]);
            methods.setValue('insideEndHour', afterApproveTime[1]);
            methods.setValue('insideSelectTimeInclude', 'selectTimeInclude');
          }
        }
        return;
      } else if (key === 'afterApproveExternal') {
        const afterApproveExternalValue = p_policyDetail.afterApprove.split('/');
        methods.setValue(key, afterApproveExternalValue[0]);
        setOutsideApproveLimitState(afterApproveExternalValue[0]);
        if (afterApproveExternalValue[0] === '1') {
          setWeekValueExternal(afterApproveExternalValue[1]);
        }
        if (afterApproveExternalValue[2] === 'all' || afterApproveExternalValue[2] === 'none') {
          methods.setValue('outsideUseYn', false);
        } else {
          methods.setValue('outsideUseYn', true);
          const afterApproveExternalTime = afterApproveExternalValue[2].split('~');
          if (afterApproveExternalTime[0].includes('!')) {
            methods.setValue('outsideSelectTimeInclude', 'selectTimeExclude');
            let firstTime = afterApproveExternalTime[0].replace('!', '');
            methods.setValue('outsideStartHour', firstTime);
            methods.setValue('outsideEndHour', afterApproveExternalTime[1]);
          } else {
            methods.setValue('outsideStartHour', afterApproveExternalTime[0]);
            methods.setValue('outsideEndHour', afterApproveExternalTime[1]);
            methods.setValue('outsideSelectTimeInclude', 'selectTimeInclude');
          }
        }
        return;
      }
      methods.setValue(key, p_policyDetail[`${key}`]);
    });
  };

  // 라디오 버튼, select 박스 값 변경 이벤트
  const handleChange = ({ value, type, name, checked }) => {
    if (type === 'checkbox') {
      const nameCheck = name.split('.');
      if (nameCheck[0] === 'insideUseYn') {
        if (event.target.checked) {
          setEnabledFlag({
            ...enabledFlag,
            insideUseFlag: true,
          });
          return value;
        } else {
          setEnabledFlag({
            ...enabledFlag,
            insideUseFlag: false,
          });
          return checked;
        }
      } else if (nameCheck[0] === 'outsideUseYn') {
        if (event.target.checked) {
          setEnabledFlag({
            ...enabledFlag,
            outsideUseFlag: true,
          });
          return value;
        } else {
          setEnabledFlag({
            ...enabledFlag,
            outsideUseFlag: false,
          });
          return checked;
        }
      }
    } else if (type === 'radio') {
      if (name === 'afterApprove') {
        setInsideApproveLimitState(value);
        return value;
      } else if (name === 'afterApproveExternal') {
        setOutsideApproveLimitState(value);
        return value;
      }
    } else if (type === 'select') {
      if (name === 'policyType') {
        return value;
      }
    }
  };

  const doSave = async () => {
    const updateData = {
      // ...formData,
      policyCd: newPolicyCd,
      id: id,
    };
    console.log(updateData);

    if (userDeptFlag === 'user') {
      const result = await apiCall(transferUserApi.updateTransferUserPolicy, updateData);
      if (result.status === 200) {
        openModal({
          message: `사용자 정책 정보가 수정되었습니다..`,
          onConfirm: () => {
            getTransferUserList();
            // getTransferUserList(parameters);
            // doUserInsert();
          },
        });
      }
    } else if (userDeptFlag === 'dept') {
      const result = await apiCall(deptListApi.updateDeptListPolicy, updateData);
      if (result.status === 200) {
        openModal({
          message: `부서 정책 정보가 수정되었습니다..`,
          onConfirm: () => {
            getTransferUserList();
            // getTransferUserList(parameters);
            // doUserInsert();
          },
        });
      }
    }
  };

  return (
    <>
      <GridItem item directionHorizon="space-between">
        <Box />
        <Button color="primary" variant="contained" name="passwordChange" onClick={() => doSave()}>
          저장
        </Button>
      </GridItem>
      <FormProvider {...methods}>
        <form id="transferUserPolicy">
          <GridItem container>
            <GridItem item direction="row" container divideColumn={1}>
              <Typography variant="h5">기본 정보</Typography>
              <GridItem
                borderFlag
                container
                divideColumn={3.5}
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '150px', minWidth: '150px' },
                  '.inputBox': { maxWidth: '160px', minWidth: '160px' },
                  '.select': { maxWidth: '160px', minWidth: '160px' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} colSpan={1.5}>
                  <LabelInput
                    labelBackgroundFlag
                    label="정책 코드"
                    name="policyType"
                    type="select"
                    list={[
                      { value: 'S', label: '시스템 정책' },
                      { value: 'D', label: '부서 정책' },
                      { value: 'U', label: '개인 정책' },
                      { value: 'T', label: '그룹 정책' },
                    ]}
                    onHandleChange={handleChange}
                    // disabled
                    disabledefault="true"
                  />
                  <LabelInput
                    name="policyCd"
                    type="select"
                    list={viewPolicyList}
                    disabledefault="true"
                    onHandleChange={policyDetailChange}
                  />
                </Stack>

                <LabelInput labelBackgroundFlag label="정책 이름" name="policyName" disabled />
                <LabelInput
                  labelBackgroundFlag
                  type="select"
                  label="URL 자동전환"
                  name="urlType"
                  disabled
                  disabledefault="true"
                  list={[
                    { value: '0', label: '사용 안함' },
                    { value: '1', label: '사용' },
                  ]}
                />
              </GridItem>

              {/* <LabelInput
                type="checkbox"
                name="useSubCheck"
                onHandleChange={handleChange}
                list={[
                  {
                    label: '개인정책 신규추가',
                    value: 'Y',
                  },
                ]}
                sx={{
                  fontSize: '11px',
                }}
              /> */}
              <br />
              <Typography variant="h5">파일 전송 정보</Typography>
              <GridItem
                borderFlag
                container
                divideColumn={1}
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '170px', minWidth: '170px' },
                  '.inputBox': { maxWidth: '200px', minWidth: '200px' },
                  '.select': { maxWidth: '175px', minWidth: '175px' },
                  '& .MuiBox-root': { padding: '0' },
                }}
              >
                <Label
                  labelBackgroundFlag
                  label="기능 제한"
                  labelSx={{ minWidth: '150px', maxWidth: '150px' }}
                >
                  <GridItem container item divideColumn={2} spacing={1} pb={2}>
                    <GridItem
                      container
                      item
                      colSpan={2}
                      sx={{
                        pl: '15px',
                        height: '100%',
                        borderBottom: 1,
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[300],
                      }}
                    >
                      <LabelInput
                        labelBackgroundFlag
                        type="radio"
                        name="policyFlag"
                        onHandleChange={handleChange}
                        disabled
                        list={[
                          { disabled: true, value: '1', label: '반입' },
                          { disabled: true, value: '2', label: '반출' },
                          { disabled: true, value: '3', label: '반입+반출' },
                          { disabled: true, value: '4', label: '사용금지' },
                        ]}
                      />
                    </GridItem>
                    <Label label="[내부]" labelSx={{ color: '#3f6ae4', fontWeight: 'bold' }} />
                    <Label label="[외부]" labelSx={{ color: '#3f6ae4', fontWeight: 'bold' }} />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LabelInput label="파일갯수 제한" name="limitCount" fullWidth disabled />
                      <FormHelperText>(Max.2000)</FormHelperText>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LabelInput label="파일갯수 제한" name="limitCountExternal" disabled />
                      <FormHelperText>(Max.2000)</FormHelperText>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LabelInput label="파일 사이즈 제한" name="limitSize" fullWidth disabled />
                      <FormHelperText>(Max.30000)</FormHelperText>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LabelInput label="파일 사이즈 제한" name="limitSizeExternal" disabled />
                      <FormHelperText>(Max.30000)</FormHelperText>
                    </Stack>
                    <LabelInput label="일일전송 횟수 제한" name="dayLimitCount" disabled />
                    <LabelInput label="일일전송 횟수 제한" name="dayLimitCountExternal" disabled />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LabelInput label="일일전송 사이즈 제한" name="dayLimitSize" disabled />
                      <FormHelperText>MB</FormHelperText>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LabelInput
                        label="일일전송 사이즈 제한"
                        name="dayLimitSizeExternal"
                        disabled
                      />
                      <FormHelperText>MB</FormHelperText>
                    </Stack>
                    <LabelInput label="다운로드 횟수 제한" name="limitDownloadCount" disabled />
                    <LabelInput
                      label="다운로드 횟수 제한"
                      name="limitDownloadCountExternal"
                      disabled
                    />
                    {/* </GridItem> */}
                  </GridItem>
                </Label>
              </GridItem>
              <br />

              <Typography variant="h5">파일 확장자 제한</Typography>

              <GridItem
                borderFlag
                container
                divideColumn={1}
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '150px', minWidth: '150px' },
                  '.inputBox': { maxWidth: '500px', minWidth: '500px' },
                  '.select': { maxWidth: '175px', minWidth: '175px' },
                }}
              >
                <Label labelBackgroundFlag label="반출">
                  <GridItem container item divideColumn={1} my={1}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <LabelInput
                        type="radio"
                        name="fileFilterType"
                        list={[
                          { disabled: true, value: '1', label: 'WhiteList' },
                          { disabled: true, value: '2', label: 'BlackList' },
                        ]}
                      />
                      <Button variant="outlined" color="secondary" disabled>
                        설정
                      </Button>
                    </Stack>

                    <LabelInput name="fileFilter" disabled />
                  </GridItem>
                </Label>

                <Label labelBackgroundFlag label="반입">
                  <GridItem container item divideColumn={1} my={1}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <LabelInput
                        type="radio"
                        name="fileFilterTypeExternal"
                        list={[
                          { disabled: true, value: '1', label: 'WhiteList' },
                          { disabled: true, value: '2', label: 'BlackList' },
                        ]}
                      />
                      <Button variant="outlined" color="secondary" disabled>
                        설정
                      </Button>
                    </Stack>

                    <LabelInput name="fileFilterExternal" disabled />
                  </GridItem>
                </Label>
              </GridItem>
              <br />

              <Typography variant="h5">결재 기능 정보</Typography>
              <GridItem
                borderFlag
                container
                divideColumn={1}
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '150px', minWidth: '150px' },
                  '.inputBox': { maxWidth: '200px', minWidth: '200px' },
                  '.select': { maxWidth: '175px', minWidth: '175px' },
                  '& .MuiBox-root': { padding: '0' },
                }}
              >
                <Label labelBackgroundFlag label="기능 제한">
                  <LabelInput
                    type="select"
                    name="approveUseType"
                    label="내부"
                    disabled
                    disabledefault="true"
                    list={[
                      { value: '1', label: '사용' },
                      { value: '0', label: '사용안함' },
                      // { value: '2', label: '미지정' },
                    ]}
                    labelSx={{
                      maxWidth: '50px !important',
                      minWidth: '50px !important',
                    }}
                  />
                  <LabelInput
                    type="select"
                    name="approveUseTypeExternal"
                    label="외부"
                    disabled
                    disabledefault="true"
                    list={[
                      { value: '1', label: '사용' },
                      { value: '0', label: '사용안함' },
                      // { value: 'unspecified', label: '미지정' },
                    ]}
                    labelSx={{
                      maxWidth: '50px !important',
                      minWidth: '50px !important',
                    }}
                  />
                </Label>

                <Label labelBackgroundFlag label="사후 결재 설정">
                  <GridItem container divideColumn={1} my={1}>
                    <GridItem
                      sx={{
                        pl: '10px',
                        pb: '8px',
                        borderBottom: 1,
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[300],
                      }}
                    >
                      <LabelInput
                        label="내부"
                        type="radio"
                        name="afterApprove"
                        onHandleChange={handleChange}
                        list={[
                          { disabled: true, value: '-1', label: '사용안함' },
                          { disabled: true, value: '1', label: '사용' },
                          { disabled: true, value: '0', label: '상위정책 사용' },
                          { disabled: true, value: '2', label: '사용시간설정' },
                        ]}
                        labelSx={{
                          textAlign: 'left',
                          fontWeight: 'bold',
                          maxWidth: '50px !important',
                          minWidth: '50px !important',
                        }}
                      />
                      <GridItem>
                        {afterApproveState === '1' && (
                          <GridItem container divideColumn={1} spacing={1} sx={{ py: 1 }}>
                            <Stack
                              direction="row"
                              alignItems="flex-start"
                              spacing={2}
                              sx={{ '& .inputText.text': { maxWidth: '150px', minWidth: '150px' } }}
                            >
                              <CheckBoxInput type="insideWeek" weekValue={weekValue} disabled />
                              <LabelInput
                                type="checkbox"
                                name="insideUseYn"
                                onHandleChange={handleChange}
                                list={[
                                  {
                                    checked: !enabledFlag.insideUseFlag,
                                    disabled: true,
                                    label: '시간선택',
                                    value: 'selectTime',
                                  },
                                ]}
                              />
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <LabelInput
                                  type="select"
                                  list={selectTimeList}
                                  name="insideStartHour"
                                  disabled={!enabledFlag.insideUseFlag}
                                  sx={{ maxWidth: '120px' }}
                                />
                                <FormHelperText>시</FormHelperText>
                                <FormHelperText>~</FormHelperText>
                                <LabelInput
                                  type="select"
                                  list={selectTimeList}
                                  name="insideEndHour"
                                  disabled={!enabledFlag.insideUseFlag}
                                  sx={{ maxWidth: '120px' }}
                                />
                                <FormHelperText>시</FormHelperText>
                                <LabelInput
                                  type="select"
                                  name="insideSelectTimeInclude"
                                  disabled={!enabledFlag.insideUseFlag}
                                  disabledefault="true"
                                  list={[
                                    { value: 'selectTimeInclude', label: '선택시간 포함' },
                                    { value: 'selectTimeExclude', label: '선택시간 제외' },
                                  ]}
                                  sx={{ minWidth: '140px' }}
                                />
                              </Stack>
                            </Stack>
                          </GridItem>
                        )}
                        {afterApproveState === '-1' && <GridItem spacing={1} />}
                        {afterApproveState === '0' && (
                          <GridItem container divideColumn={8} spacing={1} sx={{ py: 1 }}>
                            <Label labelSx={{ textAlign: 'left' }} label="정책 선택" />
                            <LabelInput
                              name="prePolicyType"
                              type="select"
                              fullWidth
                              list={[
                                { value: 'systemPolicy', label: '시스템 정책' },
                                { value: 'deptPolicy', label: '부서 정책' },
                                { value: 'userPolicy', label: '개인 정책' },
                                { value: 'groupPolicy', label: '그룹 정책' },
                              ]}
                              disabledefault="true"
                            />
                            <LabelInput
                              name="prePolicyName"
                              type="select"
                              fullWidth
                              list={[
                                { value: 'SYS1', label: '정책1' },
                                { value: 'SYS2', label: '정책2' },
                                { value: 'SYS3', label: '정책3' },
                                { value: 'SYS4', label: '정책4' },
                              ]}
                              disabledefault="true"
                            />
                          </GridItem>
                        )}
                      </GridItem>
                    </GridItem>
                    <GridItem
                      sx={{
                        pl: '10px',
                        pt: '8px',
                      }}
                    >
                      <LabelInput
                        label="외부"
                        type="radio"
                        name="afterApproveExternal"
                        onHandleChange={handleChange}
                        list={[
                          { disabled: true, value: '-1', label: '사용안함' },
                          { disabled: true, value: '1', label: '사용' },
                          { disabled: true, value: '0', label: '상위정책 사용' },
                          { disabled: true, value: '2', label: '사용시간설정' },
                        ]}
                        labelSx={{
                          textAlign: 'left',
                          fontWeight: 'bold',
                          maxWidth: '50px !important',
                          minWidth: '50px !important',
                        }}
                      />
                      <GridItem>
                        {afterApproveExternalState === '1' && (
                          <GridItem container divideColumn={1} spacing={1} sx={{ py: 1 }}>
                            <Stack
                              direction="row"
                              alignItems="flex-start"
                              spacing={2}
                              sx={{ '& .inputText.text': { maxWidth: '150px', minWidth: '150px' } }}
                            >
                              <CheckBoxInput
                                type="externalWeek"
                                weekValue={weekValueExternal}
                                disabled
                              />
                              <LabelInput
                                type="checkbox"
                                name="outsideUseYn"
                                onHandleChange={handleChange}
                                list={[
                                  {
                                    checked: !enabledFlag.outsideUseFlag,
                                    disabled: true,
                                    label: '시간선택',
                                    value: 'selectTime',
                                  },
                                ]}
                              />
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <LabelInput
                                  type="select"
                                  name="outsideStartHour"
                                  list={selectTimeList}
                                  disabled={!enabledFlag.outsideUseFlag}
                                  sx={{ maxWidth: '120px' }}
                                />
                                <FormHelperText>시</FormHelperText>
                                <FormHelperText>~</FormHelperText>
                                <LabelInput
                                  type="select"
                                  list={selectTimeList}
                                  name="outsideEndHour"
                                  disabled={!enabledFlag.outsideUseFlag}
                                  sx={{ maxWidth: '120px' }}
                                />
                                <FormHelperText>시</FormHelperText>
                                <LabelInput
                                  type="select"
                                  name="outsideSelectTimeInclude"
                                  disabled={!enabledFlag.outsideUseFlag}
                                  disabledefault="true"
                                  list={[
                                    { value: 'selectTimeInclude', label: '선택시간 포함' },
                                    { value: 'selectTimeExclude', label: '선택시간 제외' },
                                  ]}
                                  sx={{ minWidth: '140px' }}
                                />
                              </Stack>
                            </Stack>
                          </GridItem>
                        )}
                        {afterApproveExternalState === '-1' && <GridItem spacing={1} />}
                        {afterApproveExternalState === '0' && (
                          <GridItem container divideColumn={8} spacing={1} sx={{ py: 1 }}>
                            <Label labelSx={{ textAlign: 'left' }} label="정책 선택" />
                            <LabelInput
                              name="prePolicyTypeExteranl"
                              type="select"
                              fullWidth
                              list={[
                                { value: 'systemPolicy', label: '시스템 정책' },
                                { value: 'deptPolicy', label: '부서 정책' },
                                { value: 'userPolicy', label: '개인 정책' },
                                { value: 'groupPolicy', label: '그룹 정책' },
                              ]}
                              disabledefault="true"
                            />
                            <LabelInput
                              name="prePolicyNameExternal"
                              type="select"
                              fullWidth
                              list={[
                                { value: 'SYS1', label: '정책1' },
                                { value: 'SYS2', label: '정책2' },
                                { value: 'SYS3', label: '정책3' },
                                { value: 'SYS4', label: '정책4' },
                              ]}
                              disabledefault="true"
                            />
                          </GridItem>
                        )}
                      </GridItem>
                    </GridItem>
                  </GridItem>
                </Label>
              </GridItem>

              <br />
              <Typography variant="h5">클립보드 정책 정보</Typography>

              <GridItem
                borderFlag
                container
                divideColumn={3}
                // md={18}
                sx={{
                  mt: '7px',
                  '& .text': { maxWidth: '180px', minWidth: '180px' },
                  '.inputBox': { maxWidth: '160px', minWidth: '160px' },
                  '.select': { maxWidth: '160px', minWidth: '160px' },
                }}
              >
                <LabelInput
                  labelBackgroundFlag
                  type="select"
                  name="clipboardPolicyFlag"
                  disabled
                  disabledefault="true"
                  label="기능 제한"
                  onHandleChange={handleChange}
                  list={[
                    { value: '1', label: '반입' },
                    { value: '2', label: '반출' },
                    { value: '3', label: '반입+반출' },
                    { value: '4', label: '사용금지' },
                  ]}
                />
                <LabelInput
                  labelBackgroundFlag
                  type="select"
                  name="clipboardHistoryFlag"
                  label="클립보드 이력 저장"
                  disabled
                  disabledefault="true"
                  list={[
                    { value: '1', label: '저장' },
                    { value: '2', label: '삭제' },
                  ]}
                />
                <LabelInput
                  labelBackgroundFlag
                  type="select"
                  name="clipboardBackupFlag"
                  label="원본 저장 여부"
                  disabled
                  disabledefault="true"
                  list={[
                    { value: '0', label: '저장' },
                    { value: '1', label: '저장 안함' },
                  ]}
                />

                <Stack direction="row" alignItems="center" spacing={1}>
                  <LabelInput
                    labelBackgroundFlag
                    label="클립보드 사이즈 제한"
                    name="clipboardLimitSize"
                    disabled
                    sx={{ '.inputBox': { maxWidth: '160px', minWidth: '90px' } }}
                  />
                  <FormHelperText sx={{ width: '100px' }}>(Max.5000 MB)</FormHelperText>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LabelInput
                    labelBackgroundFlag
                    label="클립보드 1일 횟수 제한"
                    name="clipboardDayLimitCount"
                    disabled
                    sx={{ '.inputBox': { maxWidth: '160px', minWidth: '90px' } }}
                  />
                  <FormHelperText sx={{ width: '100px' }}>(Max.2000 MB)</FormHelperText>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LabelInput
                    labelBackgroundFlag
                    label="클립보드 1일 사이즈 제한"
                    name="clipboardDayLimitSize"
                    disabled
                    sx={{ '.inputBox': { maxWidth: '160px', minWidth: '90px' } }}
                  />
                  <FormHelperText sx={{ width: '100px' }}>(Max.5000 MB)</FormHelperText>
                </Stack>

                {/* <GridItem
                  container
                  colSpan={3}
                  my={1}
                  sx={{
                    '& .text': { maxWidth: '170px', minWidth: '170px' },
                  }}
                >
                   <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LabelInput
                      label="클립보드 사이즈 제한"
                      name="clipboardLimitSize"
                      fullWidth
                      disabled
                    />
                    <FormHelperText>(Max.5000 MB)</FormHelperText>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LabelInput
                      label="클립보드 1일 횟수 제한"
                      name="clipboardDayLimitCount"
                      fullWidth
                      disabled
                    />
                    <FormHelperText>(Max.2000 MB)</FormHelperText>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LabelInput
                      label="클립보드 1일 사이즈 제한"
                      name="clipboardDayLimitSize"
                      fullWidth
                      disabled
                    />
                    <FormHelperText>(Max.5000 MB)</FormHelperText>
                  </Stack> 
                </GridItem>*/}
              </GridItem>
            </GridItem>
          </GridItem>
        </form>
      </FormProvider>
      <br />
    </>
  );
}

export default TransferUserPolicy;
