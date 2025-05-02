import Layout from '@components/layouts';
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import { useSession } from 'next-auth/react';
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import GridItem from '@components/modules/grid/GridItem';
import MainCard from '@components/mantis/MainCard';
import { Stack, Typography, Tooltip } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/styles';
import LabelInput from '@components/modules/input/LabelInput';
import Label from '@components/modules/label/Label';
import { PlayCircle, GppGood, GppBad, Info } from '@mui/icons-material';
import ButtonSet from '@components/modules/button/ButtonSet';
import adminApi from '@api/system/adminApi';
import useConfirmModal from '@modules/hooks/useConfirmModal';

const cardTitleStyled = {
  height: '50px',
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

function AdminInsertPopup() {
  const { instance } = AuthInstance();
  adminApi.axios = instance;

  const theme = useTheme();

  const {
    data: {
      user: { name },
    },
  } = useSession();

  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  const openConfirmModal = useConfirmModal();

  const [enabledFlag, setEnabledFlag] = useState({
    userPassword: true,
    confirmPassword: true,
    approveYn: false,
    deptNm: false,
    validYn: true,
    startUseDate: true,
    endUseDate: true,
  });

  const methods = useForm({
    defaultValues: {
      userId: '',
      userName: '',
      grpSeq: '',
      userPermissionId: [],
      userPassword: '',
      confirmPassword: '',
      deleteYn: 'Y',
    },
  });

  const [passwordCheck, setPasswordCheck] = useState(null);
  const [validPassword, setValidPassword] = useState(false);

  const [userInfoRules, setUserInfoRules] = useState({
    pwdMinLen: '0',
    pwdMaxLen: '0',
    ccCntLimit: '0',
    scCntLimit: '0',
    esMinLen: '0',
    ebMinLen: '0',
    numMinLen: '0',
    scMinLen: '0',
    idPwdInName: 'Y',
    idPwdInId: 'Y',
    idNminLen: '0',
    idEminLen: '0',
    idMinLen: '0',
    idPwdTemp: '1',
  });

  // 관리자 권한 콤보 데이터
  const [adminPermissionData, setAdminPermissionData] = useState([]);

  const handleSaveDialogOpen = () => {
    if (!passwordCheck) {
      openModal({
        message: '패스워드가 일치하지 않습니다.',
        onConfirm: () => {
          setTimeout(() => methods.setFocus('userPassword'), 300);
        },
      });

      return;
    }

    if (methods.getValues('tempPwdYn') === 'N' && !validPassword) {
      openModal({
        message: '패스워드 유효성 검사를 확인하세요.',
        onConfirm: () => {
          setTimeout(() => methods.setFocus('userPassword'), 300);
        },
      });

      return;
    }

    openConfirmModal({
      message: '관리자 정보를 저장하시겠습니까?',
      onConfirm: () => {
        methods.setValue('flag', 'tab');
      },
      target: 'adminInfo',
      methods,
    });
  };

  const doSave = async (data) => {
    if (data.startUseDate) {
      data.startUseDate = HsLib.removeDateFormat(data.startUseDate) + '000000';
    }
    if (data.endUseDate) {
      data.endUseDate = HsLib.removeDateFormat(data.endUseDate) + '000000';
    }

    const result = await apiCall(adminApi.saveAdminList, data);

    let message;
    if (result.status === 200) {
      if (result.data > 0) {
        message = '저장되었습니다.';
      } else {
        message = '이미 등록된 사용자 ID입니다.';
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

  const init = async () => {
    adminPermissionList();

    HsLib.getDefaultDateForm(methods.setValue, 'E', '1Y', 'startUseDate', 'endUseDate');
    if (opener?.grpSeq) {
      methods.setValue('grpSeq', opener.grpSeq);
    } else {
      methods.setValue('grpSeq', '9999');
    }
  };

  // 관리자 권한 콤보 데이터
  const adminPermissionList = async () => {
    const result = await apiCall(adminApi.getAdminPermissionList);

    let permissionData = [];

    if (result.status === 200) {
      result.data.map((data) => {
        permissionData = [...permissionData, { label: data.userPermissionName, value: data.id }];
      });
      setAdminPermissionData(permissionData);
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
  }, []);

  // 활성화할 list 항목
  // userPermissionId(selectBox의 name) methods.getValue값이 변화할 때,
  // approveYn: 슈퍼바이저, 솔루션관리자, 플랫폼관리자 일 경우 enabledFlag.approveYn: true... true로 리턴
  const enabledFormList = {
    tempPwdYn: {
      userPassword: ['N'],
      confirmPassword: ['N'],
    },

    validYn: {
      startUseDate: ['Y', ''],
      endUseDate: ['Y', ''],
    },
  };

  // methods
  // form 으로 사용 시 추가 필요 (form 사용 시 onChange 값을 확인 할 수 없으니 watch 사용)
  // onClick 프로퍼티 사용 시 키보드 조작 판별 못함, onChange 프로퍼티는 동작 X
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
        useEffect_0002.current = true;
        return; 
      } 
    }
    const formSubscription = methods.watch((map, names) => {
      if (map['tempPwdYn'] === 'Y') {
        setPasswordCheck(true);
        setValidPassword(true);
      } else {
        if (!map['userPassword'] || !map['confirmPassword']) {
          setPasswordCheck(null);
        } else {
          if (map['userPassword'] === map['confirmPassword']) {
            setPasswordCheck(true);
          } else {
            setPasswordCheck(false);
          }
        }

        if (!map['userId'] && !map['userName']) {
          setValidPassword(HsLib.isValidPassword(map['userPassword'], userInfoRules));
        } else if (map['userId'] && !map['userName']) {
          setValidPassword(
            HsLib.isValidPassword(map['userPassword'], userInfoRules, map['userId']),
          );
        } else if (map['userName'] && !map['userId']) {
          setValidPassword(
            HsLib.isValidPassword(map['userPassword'], userInfoRules, null, map['userName']),
          );
        } else {
          setValidPassword(
            HsLib.isValidPassword(
              map['userPassword'],
              userInfoRules,
              map['userId'],
              map['userName'],
            ),
          );
        }
      }
    });
  }, [methods.watch, userInfoRules]);

  return (
    <FormProvider {...methods}>
      <form id="adminInfo" onSubmit={methods.handleSubmit(doSave)}>
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
                    관리자 기본 정보
                  </Typography>

                  <ButtonSet
                    type="custom"
                    options={[
                      {
                        label: '저장',
                        color: 'primary',
                        callBack: handleSaveDialogOpen,
                      },
                    ]}
                  />
                </GridItem>
              }
              headerSX={cardTitleStyled}
            >
              <GridItem
                container
                item
                divideColumn={2}
                borderFlag
                sx={{
                  '& .text': { maxWidth: '155px', minWidth: '155px' },
                  '.inputBox': { width: '100%' },
                  '.MuiInputBase-input[name="userPassword"]': {
                    maxWidth: '120px',
                    minWidth: '120px',
                  },
                  '.MuiInputBase-input[name="confirmPassword"]': {
                    maxWidth: '114px',
                    minWidth: '114px',
                  },
                }}
              >
                {/* <BootstrapTooltip
                  title={
                    <>
                      <Typography variant="caption" display="block">
                        <Info sx={{ fontSize: '1em' }} /> 최소 {userInfoRules.idMinLen}자리 이상
                      </Typography>
                      <Typography variant="caption" display="block">
                        <Info sx={{ fontSize: '1em' }} /> 영문자 최소 {userInfoRules.idEminLen}자리
                        이상
                      </Typography>
                      <Typography variant="caption" display="block">
                        <Info sx={{ fontSize: '1em' }} /> 숫자 최소 {userInfoRules.idNminLen}자리
                        이상
                      </Typography>
                    </>
                  }
                  placement="bottom"
                >
                  <LabelInput
                    required
                    label="관리자 ID"
                    name="userId"
                    fullWidth
                    labelBackgroundFlag
                  />
                </BootstrapTooltip> */}
                <LabelInput
                  required
                  label="관리자 ID"
                  name="userId"
                  fullWidth
                  labelBackgroundFlag
                />
                <LabelInput
                  required
                  label="관리자명"
                  name="userName"
                  fullWidth
                  labelBackgroundFlag
                />

                <GridItem
                  divideColumn={2}
                  item
                  xs={48}
                  sm={24}
                  md={16}
                  direction="row"
                  borderFlag
                  sx={{ flex: 1, alignItems: 'baseline' }}
                >
                  <Label label="패스워드" labelBackgroundFlag required>
                    <GridItem
                      item
                      direction="row"
                      sx={{ flex: 1, alignItems: 'baseline' }}
                      directionHorizon="space-between"
                    >
                      {/* <BootstrapTooltip
                        title={
                          <>
                            <Typography variant="caption" display="block">
                              <Info sx={{ fontSize: '1em' }} /> 최소 {userInfoRules.pwdMinLen}자리
                              이상, 최대 {userInfoRules.pwdMaxLen}자리 이하
                            </Typography>
                            <Typography variant="caption" display="block">
                              <Info sx={{ fontSize: '1em' }} /> 영소문자 최소{' '}
                              {userInfoRules.esMinLen}
                              자리 이상
                            </Typography>
                            <Typography variant="caption" display="block">
                              <Info sx={{ fontSize: '1em' }} /> 영대문자 최소{' '}
                              {userInfoRules.ebMinLen}
                              자리 이상
                            </Typography>
                            <Typography variant="caption" display="block">
                              <Info sx={{ fontSize: '1em' }} /> 숫자 최소 {userInfoRules.numMinLen}
                              자리 이상, 특수문자 최소 {userInfoRules.scMinLen}자리 이상
                            </Typography>
                            <Typography variant="caption" display="block">
                              <Info sx={{ fontSize: '1em' }} /> {userInfoRules.ccCntLimit}자리 이하
                              연속문자, {userInfoRules.scCntLimit}자리 이하 동일문자
                            </Typography>
                            {userInfoRules.idPwdInId === 'Y' ||
                            userInfoRules.idPwdInName === 'Y' ? (
                              <Typography variant="caption" display="block">
                                <Info sx={{ fontSize: '1em' }} />{' '}
                                {userInfoRules.idPwdInId === 'Y' ? '사용자 ID 포함 불가' : ''}
                                {userInfoRules.idPwdInId === 'Y' &&
                                userInfoRules.idPwdInName === 'Y'
                                  ? ', '
                                  : ''}
                                {userInfoRules.idPwdInName === 'Y' ? '사용자명 포함 불가' : ''}
                              </Typography>
                            ) : (
                              <></>
                            )}
                          </>
                        }
                        placement="bottom"
                        disableFocusListener={!enabledFlag.userPassword}
                        disableHoverListener={!enabledFlag.userPassword}
                      > */}
                      <LabelInput
                        sx={
                          enabledFlag.userPassword
                            ? null
                            : {
                                '& .MuiInputBase-input': {
                                  backgroundColor: theme.palette.grey[100],
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  textFillColor: `${theme.palette.grey[900]} !important`,
                                  fontWeight: 'bold',
                                },
                              }
                        }
                        required={enabledFlag.userPassword}
                        errorMesg="패스워드을(를) 입력해주세요."
                        disabled={!enabledFlag.userPassword}
                        name="userPassword"
                        htmlType="password"
                        fullWidth
                        labelBackgroundFlag
                      />
                      {/* </BootstrapTooltip> */}
                      <Stack direction="row">
                        <Typography
                          variant="body1"
                          sx={{
                            color: passwordCheck ? (validPassword ? 'green' : 'red') : 'red',
                            fontWeight: 'bold',
                            fontSize: '0.7em',
                            minWidth: '115px',
                            alignSelf: 'center',
                          }}
                        >
                          {passwordCheck === null ? (
                            ''
                          ) : passwordCheck ? (
                            validPassword ? (
                              <>
                                <GppGood sx={{ fontSize: '1em' }} /> Success
                              </>
                            ) : (
                              ''
                              // <>
                              //   <GppBad sx={{ fontSize: '1em' }} /> 패스워드 규칙 불일치
                              // </>
                            )
                          ) : (
                            <>
                              <GppBad sx={{ fontSize: '1em' }} /> 패스워드 불일치
                            </>
                          )}
                        </Typography>
                      </Stack>
                    </GridItem>
                  </Label>
                  <GridItem item direction="row" sx={{ flex: 1, alignItems: 'baseline' }}>
                    <Label label="패스워드 확인" required labelBackgroundFlag>
                      <LabelInput
                        style={
                          enabledFlag.userPassword
                            ? { marginLeft: '6px' }
                            : { marginLeft: '6px', backgroundColor: theme.palette.grey[100] }
                        }
                        required={enabledFlag.userPassword}
                        disabled={!enabledFlag.userPassword}
                        name="confirmPassword"
                        htmlType="password"
                      />
                    </Label>
                  </GridItem>
                </GridItem>

                <GridItem
                  container
                  item
                  borderFlag
                  divideColumn={4}
                  colSpan={4}
                  xs={48}
                  sm={24}
                  md={16}
                  sx={{
                    '& .text': { maxWidth: '155px', minWidth: '155px' },
                    '.inputBox': { width: '100%' },
                  }}
                >
                  <LabelInput
                    labelBackgroundFlag
                    disabled={!enabledFlag.startUseDate}
                    type="date1"
                    label="유효기간 시작일"
                    name="startUseDate"
                    rules={{
                      validate: (value) =>
                        HsLib.isValidDatePeriod(value, methods.getValue('endUseDate')),
                    }}
                  />
                  <LabelInput
                    labelBackgroundFlag
                    disabled={!enabledFlag.endUseDate}
                    type="date1"
                    label="유효기간 종료일"
                    name="endUseDate"
                    rules={{
                      validate: (value) =>
                        HsLib.isValidDatePeriod(methods.getValue('startUseDate'), value),
                    }}
                  />
                </GridItem>

                <LabelInput
                  required
                  type="select"
                  label="삭제여부"
                  name="deleteYn"
                  fullWidth
                  labelBackgroundFlag
                  list={[
                    { value: 'N', label: 'N' },
                    { value: 'Y', label: 'Y' },
                  ]}
                />
                <LabelInput
                  required
                  type="select"
                  label="관리자 권한"
                  name="userPermissionId"
                  list={adminPermissionData}
                  fullWidth
                  labelBackgroundFlag
                />
              </GridItem>
            </MainCard>
          </GridItem>
        </GridItem>
      </form>
    </FormProvider>
  );
}

AdminInsertPopup.getLayout = function getLayout(page) {
  return (
    <Layout variant="popup" title="관리자 추가">
      {page}
    </Layout>
  );
};

export default AdminInsertPopup;
