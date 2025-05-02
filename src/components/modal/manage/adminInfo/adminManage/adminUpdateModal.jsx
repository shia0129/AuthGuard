// libraries
import { useEffect, useState,useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/material/styles';
import { GppGood, GppBad, Info } from '@mui/icons-material';
import { Stack, Typography, Tooltip } from '@mui/material';
import { unstable_batchedUpdates } from 'react-dom';
import moment from 'moment';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import Label from '@components/modules/label/Label';
import PopUp from '@components/modules/common/PopUp';
// functions
import { AuthInstance } from '@modules/axios';
import HsLib from '@modules/common/HsLib';
import useApi from '@modules/hooks/useApi';
import adminApi from '@api/system/adminApi';
import preferencesApi from '@api/system/preferencesApi';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
// Tooltip 정의
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


// Form 초기값 선언
const initInfos = {
  userId: '',
  userName: '',
  startUseDate: '',
  endUseDate: '',
  userPermissionId: '',
  allowIpYn: '',
  allowIpAddress: '',
  deleteYn: '',
};
function AdminUpdateModal({ alertOpen, setModalOpen, modalParams, getAdminList }) {
  const { id } = modalParams;
  const { data: session } = useSession();
  

  const theme = useTheme();
  const { instance } = AuthInstance();
  adminApi.axios = instance;
  preferencesApi.axios = instance;
  const [apiCall, openModal] = useApi();

  const parameterData = useSelector((state) => state.adminManage);
  const adminPermissionParamList = parameterData.adminPermissionParamList;

  const methods = useForm({
    defaultValues: initInfos,
  });

  const [adminInfos, setAdminInfos] = useState(null);

  // 패스워드 규칙 상태값
  const [passwordRules, setPasswordRules] = useState({
    ccCntLimit: '0',
    ebMinLen: '0',
    esMinLen: '0',
    idPwdInId: 'Y',
    idPwdInName: 'Y',
    idPwdTemp: '1',
    numMinLen: '0',
    pwdMaxLen: '0',
    pwdMinLen: '0',
    scCntLimit: '0',
    scMinLen: '0',
  });
  const [enabledFlag, setEnabledFlag] = useState({
    userPassword: true,
    confirmPassword: true,
    startUseDate: true,
    endUseDate: true,
  });
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [validPassword, setValidPassword] = useState(false);
  const useEffect_0001 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    // 팝업 사이즈 조절
    HsLib.windowResize(1290, 565);
    // 초기화 함수
    init();
  }, []);
  // 초기화 함수
  const init = async () => {
    // 선택된 관리자 정보 요청

     const hsssessionid = session?.user.hsssessionid;
    //const usernum = userSeq ? userSeq : session.user.userSeq;
    const adminListDetail = await apiCall(
      adminApi.getAdminListDetail,
      { id:id, hsssessionid:hsssessionid }
    );
    
    // 패스워드규칙 요청
    const passwordRulesList = await apiCall(preferencesApi.getPreferences, {
      configType: 'PASSWORD',
      hasToken: false,
    });
    // 일괄 변경처리
    if (adminListDetail.status === 200) {
      unstable_batchedUpdates(() => {
        // 선택된 관리자 정보 응답처리
        responseAdminListDetail(adminListDetail);
        // 패스워드규칙 응답처리
        responsePasswordRulesList(passwordRulesList);
      });
    }
  };
  // 선택된 관리자 정보 응답처리
  const responseAdminListDetail = (p_adminListDetail) => {
    // 관리자정보 상태값 변경
    setAdminInfos(p_adminListDetail.data);
    // 일자 세팅
    Object.keys(initInfos).forEach((key) => {
      console.log();

      if (Array.isArray(p_adminListDetail.data[`${key}`])) {
        methods.setValue(key, p_adminListDetail.data[`${key}`]);
      } else {
        if (key === 'startUseDate') {
          methods.setValue(
            'startUseDate',
            HsLib.changeDateFormat(p_adminListDetail.data[`${key}`], '$1-$2-$3'),
          );
        } else if (key === 'endUseDate') {
          methods.setValue(
            'endUseDate',
            HsLib.changeDateFormat(p_adminListDetail.data[`${key}`], '$1-$2-$3'),
          );
        } else {
          methods.setValue(key, `${p_adminListDetail.data[`${key}`]}`);
        }
        methods.setValue(
          'timeValue',
          moment(HsLib.changeDateFormat('20240321143200', '$1-$2-$3 $4:$5')),
        );

        methods.setValue(
          'dateTimeValue',
          moment(HsLib.changeDateFormat('20240321143500', '$1-$2-$3 $4:$5')),
        );
      }
    });
  };

  // 패스워드규칙 응답처리
  const responsePasswordRulesList = (p_passwordRulesList) => {
    let tempValue = [];
    if (p_passwordRulesList.status === 200) {
      p_passwordRulesList.data.map((passwordRule) => {
        const { configName, configValue } = passwordRule;
        tempValue = { ...tempValue, [configName]: configValue };
      });
      setPasswordRules((prev) => ({
        ...prev,
        ...tempValue,
      }));
    }
  };
  // 변경 데이터 저장
  const doSave = async (data) => {
    if (data.userPassword !== data.confirmPassword) {
      openModal({
        message: '비밀번호가 서로 일치하지 않습니다.',
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('userPassword');
          }, 300);
        },
      });
      return;
    }

    if (
      !HsLib.isValidPassword(
        data.userPassword,
        passwordRules,
        adminInfos.userId,
        adminInfos.userName,
      )
    ) {
      openModal({
        message: '비밀번호 규칙을 다시 확인하시고 입력하여 주세요.',
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('userPassword');
          }, 300);
        },
      });

      return;
    }

    // 유효기간 시작일
    if (moment.isMoment(data.startUseDate)) {
      data.startUseDate = data.startUseDate.format('YYYYMMDD000000');
    } else {
      data.startUseDate = HsLib.removeDateFormat(data.startUseDate) + '000000';
    }
    // 유효기간 종료일
    if (moment.isMoment(data.endUseDate)) {
      data.endUseDate = data.endUseDate.format('YYYYMMDD000000');
    } else {
      data.endUseDate = HsLib.removeDateFormat(data.endUseDate) + '000000';
    }
    // 시간(예시)
    if (moment.isMoment(data.timeValue)) {
      data.timeValue = data.timeValue.format('YYYYMMDDHHmm');
    } else {
      data.timeValue = HsLib.removeDateFormat(data.timeValue) + '0000';
    }
    // 날짜시간(예시)
    if (moment.isMoment(data.dateTimeValue)) {
      data.dateTimeValue = data.dateTimeValue.format('YYYYMMDDHHmm');
    } else {
      data.dateTimeValue = HsLib.removeDateFormat(data.dateTimeValue) + '0000';
    }

    data.id = id;

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
          setModalOpen(false);
          getAdminList();
        },
      });
    }
  };
  // JSX
  return (
    <>
      <PopUp
        maxWidth="sm"
        fullWidth
        callBack={methods.handleSubmit(doSave)}
        alertOpen={alertOpen}
        closeAlert={setModalOpen}
        title="관리자 수정"
      >
        <FormProvider {...methods}>
          <form id="adminInfo">
            <GridItem
              container
              item
              divideColumn={2}
              xs={48}
              sm={24}
              md={16}
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
              <Label
                label="관리자ID"
                labelBackgroundFlag
                data={adminInfos?.userId}
                dataTooltipFlag={false}
              />
              <LabelInput
                required
                label="관리자명"
                name="userName"
                labelBackgroundFlag
                sx={{ minWidth: '190px', maxWidth: '190px' }}
              />
            </GridItem>
            <GridItem
              divideColumn={2}
              item
              xs={48}
              sm={24}
              md={16}
              direction="row"
              borderFlag
              sx={{
                '& .text': { maxWidth: '155px', minWidth: '155px' },
                '.inputBox': { width: '100%' },
              }}
            >
              <Label label="패스워드" labelBackgroundFlag required>
                <GridItem
                  item
                  direction="row"
                  sx={{ flex: 1, alignItems: 'baseline' }}
                  directionHorizon="space-between"
                >
                  <BootstrapTooltip
                    title={
                      <>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 최소 {passwordRules.pwdMinLen}자리 이상,
                          최대 {passwordRules.pwdMaxLen}자리 이하
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 영소문자 최소 {passwordRules.esMinLen}
                          자리 이상
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 영대문자 최소 {passwordRules.ebMinLen}
                          자리 이상
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> 숫자 최소 {passwordRules.numMinLen}
                          자리 이상, 특수문자 최소 {passwordRules.scMinLen}자리 이상
                        </Typography>
                        <Typography variant="caption" display="block">
                          <Info sx={{ fontSize: '1em' }} /> {passwordRules.ccCntLimit}자리 이하
                          연속문자, {passwordRules.scCntLimit}자리 이하 동일문자
                        </Typography>
                        {passwordRules.idPwdInId === 'Y' || passwordRules.idPwdInName === 'Y' ? (
                          <Typography variant="caption" display="block">
                            <Info sx={{ fontSize: '1em' }} />{' '}
                            {passwordRules.idPwdInId === 'Y' ? '사용자 ID 포함 불가' : ''}
                            {passwordRules.idPwdInId === 'Y' && passwordRules.idPwdInName === 'Y'
                              ? ', '
                              : ''}
                            {passwordRules.idPwdInName === 'Y' ? '사용자명 포함 불가' : ''}
                          </Typography>
                        ) : (
                          <></>
                        )}
                      </>
                    }
                    placement="bottom"
                    disableFocusListener={!enabledFlag.userPassword}
                    disableHoverListener={!enabledFlag.userPassword}
                  >
                    <LabelInput
                      sx={
                        enabledFlag.userPassword
                          ? // ? null
                            { minWidth: '185px', maxWidth: '185px' }
                          : {
                              '& .MuiInputBase-input': {
                                backgroundColor: theme.palette.grey[100],
                              },
                              '& .MuiInputBase-input::placeholder': {
                                textFillColor: `${theme.palette.grey[900]} !important`,
                                fontWeight: 'bold',
                              },
                              minWidth: '185px',
                              maxWidth: '185px',
                            }
                      }
                      required={enabledFlag.userPassword}
                      errorMesg="패스워드을(를) 입력해주세요."
                      disabled={!enabledFlag.userPassword}
                      name="userPassword"
                      htmlType="password"
                      inputProps={{ autoComplete: 'off' }}
                      labelBackgroundFlag
                    />
                  </BootstrapTooltip>
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
                          <GppGood sx={{ fontSize: '1em' }}> Success</GppGood>
                        ) : (
                          <GppBad sx={{ fontSize: '1em' }}> 패스워드 규칙 불일치</GppBad>
                        )
                      ) : (
                        <GppBad sx={{ fontSize: '1em' }}> 패스워드 불일치</GppBad>
                      )}
                    </Typography>
                  </Stack>
                </GridItem>
              </Label>
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
                  errorMesg="패스워드을(를) 입력해주세요."
                  inputProps={{ autoComplete: 'off' }}
                  sx={{ minWidth: '185px', maxWidth: '185px' }}
                />
              </Label>
            </GridItem>
            <GridItem
              container
              item
              borderFlag
              divideColumn={2}
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
                type="date1"
                label="유효기간 시작일"
                name="startUseDate"
                rules={{
                  validate: (value) =>
                    HsLib.isValidDatePeriod(value, methods.getValues('endUseDate')),
                }}
              />

              <LabelInput
                labelBackgroundFlag
                type="date1"
                label="유효기간 종료일"
                name="endUseDate"
                rules={{
                  validate: (value) =>
                    HsLib.isValidDatePeriod(methods.getValues('startUseDate'), value),
                }}
              />
            </GridItem>
            <GridItem
              container
              item
              borderFlag
              divideColumn={2}
              xs={48}
              sm={24}
              md={16}
              sx={{
                '& .text': { maxWidth: '155px', minWidth: '155px' },
                '.inputBox': { width: '190px' },
              }}
            >
              <LabelInput
                required
                type="select"
                label="IP검사 사용여부"
                name="allowIpYn"
                list={[
                  { value: 'N', label: 'N' },
                  { value: 'Y', label: 'Y' },
                ]}
                fullWidth
                labelBackgroundFlag
              />
              <LabelInput
                required
                label="접속허용 IP"
                name="allowIpAddress"
                placeholder=""
                labelBackgroundFlag
                maskOptions={{ type: 'ipv4' }}
              />
            </GridItem>
            <GridItem
              container
              item
              borderFlag
              divideColumn={2}
              xs={48}
              sm={24}
              md={16}
              sx={{
                '& .text': { maxWidth: '155px', minWidth: '155px' },
                '.inputBox': { width: '100%' },
              }}
            >
              <LabelInput
                required
                type="select"
                label="삭제여부"
                name="deleteYn"
                list={[
                  { value: 'N', label: 'N' },
                  { value: 'Y', label: 'Y' },
                ]}
                fullWidth
                labelBackgroundFlag
              />
              <LabelInput
                required
                type="select"
                label="관리자 권한"
                maxLength={32}
                name="userPermissionId"
                list={adminPermissionParamList}
                fullWidth
                labelBackgroundFlag
              />
            </GridItem>
          </form>
        </FormProvider>
      </PopUp>
    </>
  );
}

AdminUpdateModal.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AdminUpdateModal;
