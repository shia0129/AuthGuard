// libraries
import { AuthInstance } from '@modules/axios';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSession, signOut } from 'next-auth/react';
import { Typography, Tooltip } from '@mui/material';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled, useTheme } from '@mui/styles';
import { Info } from '@mui/icons-material';
import { useRouter } from 'next/router';
// components
import PopUp from '@components/modules/common/PopUp';
import LabelInput from '@components/modules/input/LabelInput';
import GridItem from '@components/modules/grid/GridItem';
import Label from '@components/modules/label/Label';
// functions
import HsLib from '@modules/common/HsLib';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import useApi from '@modules/hooks/useApi';
import adminApi from '@api/system/adminApi';
import preferencesApi from '@api/system/preferencesApi';
import Loader from '@components/mantis/Loader';
import { useIntl } from 'react-intl';

const initialForm = {
  newUserId: 'hssmanager1',
  confirmnewUserId: 'hssmanager1',
  loginPincode: '1234567',
  newPincode: '7654321',
  confirmnewPincode: '7654321',
  loginPassword: 'Hsck@2301!',
  newPassword: 'Hsck@2301!!',
  confirmPassword: 'Hsck@2301!!',
  tempPwdYn: 'N',
};

const enabledFormList = {
  tempPwdYn: {
    newPassword: ['N'],
    confirmPassword: ['N'],
  },
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

function ChangePasswordModal({
  open,
  setOpen,
  type = 'self',
  parent = null,
  userSeq = null,
  userId = null,
  userName = null,
  indexKey = null,
}) {
  const intl = useIntl();
  // theme 객체(테마)
  const theme = useTheme();
  // Axios 인트턴스(Http통신)
  const { instance } = AuthInstance();
  adminApi.axios = instance;
  preferencesApi.axios = instance;
  // API, openModal 호출 함수
  const [apiCall, openModal] = useApi();
  // 세션 접근 Hook
  const { data: session, update: sessionUpdate } = useSession();
  const { push } = useRouter();
  // 확인 팝업
  const openConfirmModal = useConfirmModal();

  const tempPasswordTypeString = {
    // 1: '휴대전화',
    1: intl.formatMessage({ id: 'user.phone' }),
    // 2: '이메일',
    2: intl.formatMessage({ id: 'user.email' }),
    // 3: '사용자 ID',
    3: intl.formatMessage({ id: 'user.id' }),
  };

  // 패스워드 규칙 상태값
  const [passwordRules, setPasswordRules] = useState({
    ccCntLimit: '4', //최대 연속문자
    ebMinLen: '1', // 최소 영대문자
    esMinLen: '1', // 최소 영소문자
    idPwdInId: 'Y',
    idPwdInName: 'Y',
    idPwdTemp: '1',
    numMinLen: '1', //최소 숫자
    pwdMaxLen: '32', // 전체 패스워드 최대 길이
    pwdMinLen: '8',
    scCntLimit: '4', //이하 동일문자
    scMinLen: '1', //최소 특수문자
    // idNminLen: '0',
    // idEminLen: '0',
    // idMinLen: '0',
  });
  // 사용자 상세정보 상태값
  const [userInfos, setUserInfos] = useState(null);
  // 입력 제한 상태값
  const [enabledFlag, setEnabledFlag] = useState({
    newPassword: true,
    confirmPassword: true,
  });
  // Form 객체(초기값 할당)
  const methods = useForm({
    defaultValues: initialForm,
  });
  // CapsLock 상태값
  const [capsWarning, setCapsWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    // 초기화 함수
    init();
  }, [open]);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    const formSubscription = methods.watch((map, names) => {
      const value = map[names.name];
      const name = names.name;
      if (enabledFormList[`${name}`] !== undefined) {
        HsLib.flagStatusChange(value, setEnabledFlag, methods, enabledFormList[`${name}`]);
      }
    });
  }, [methods.watch, passwordRules]);
  // 초기화 함수
  const init = async () => {
    const hsssessionid = session?.user.hsssessionid;
    /*
    console.log(isFirstlogin);    
    console.log("-------------------------");
    console.log(session?.user);
    console.log("-------------------------");
    console.log(session);
    console.log(session?.user["hsssessionid"]);
    console.log(session?.user.hsssessionid);
    console.log("-------------------------");
    console.log(parameters);
    console.log("-------------------------");
    */

    // 패스워드 규칙 요청 rainroot: 미사용...
    const passwordRulesList = await apiCall(preferencesApi.getPreferences, {
      configType: 'PASSWORD',
      hasToken: false,
    });

    let tempValue = [];
    if (passwordRulesList.status === 200) {
      passwordRulesList.data.map((passwordRule) => {
        const { configName, configValue } = passwordRule;
        tempValue = { ...tempValue, [configName]: configValue };
      });

      setPasswordRules((prev) => ({
        ...prev,
        // ...passwordRulesList.data,
        ...tempValue,
      }));
    }
    // 사용자 상세정보 요청
    const usernum = userSeq ? userSeq : session.user.userSeq;

    if (usernum && hsssessionid) {
      const userInfosDetail = await apiCall(adminApi.getAdminListDetail, {
        id: usernum,
        hsssessionid: hsssessionid,
      });
      if (userInfosDetail.status === 200) {
        setUserInfos((prev) => ({
          ...prev,
          ...userInfosDetail.data,
        }));
      }
    }

    methods.reset();
    setEnabledFlag((prev) => ({
      ...prev,
      newPassword: true,
      confirmPassword: true,
    }));
  };
  // 키보드입력 이벤트
  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }

    if (keyEvent.key === 'Enter') {
      keyEvent.preventDefault();
      doSave();
    }
  };

  // 사용자 패스워드 변경
  const changeUserPassword = async (data) => {
    const hsssessionid = session?.user.hsssessionid;
    if (userId === data.userId) {
      openModal({
        // message: '신규 ID는 사용자 ID와 다르게 변경해야 합니다.',
        message: intl.formatMessage({ id: 'user.id-difference-msg' }),
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('userId');
          }, 300);
        },
      });
      return;
    }
    if (data.loginPincode === data.newPincode) {
      openModal({
        // message: '신규 Pincode는 현재 Pincode와 다르게 변경해야 합니다.',
        message: intl.formatMessage({ id: 'user.pin-difference-msg' }),
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('newPincode');
          }, 300);
        },
      });
      return;
    }

    if (data.tempPwdYn === 'N') {
      if (data.loginPassword === data.newPassword) {
        openModal({
          // message: '신규 비밀번호는 현재 비밀번호와 다르게 변경해야 합니다.',
          message: intl.formatMessage({ id: 'user.password-current-difference-msg' }),
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
        return;
      }
    }

    if (data.tempPwdYn === 'N') {
      if (data.newPassword.includes(data.loginPassword)) {
        openModal({
          // message: '신규 비밀번호는 현재 비밀번호를 포함하면 안됩니다.',
          message: intl.formatMessage({ id: 'user.password-not-include-current-msg' }),
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
        return;
      }
    }

    if (
      data.tempPwdYn === 'N' &&
      !HsLib.isValidPassword(data.newPassword, passwordRules, userInfos.userId, userInfos.userName)
    ) {
      openModal({
        // message: '비밀번호 규칙을 다시 확인하시고 입력하여 주세요.',
        message: intl.formatMessage({ id: 'user.password-check-policy-msg' }),
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('newPassword');
          }, 300);
        },
      });

      return;
    }

    setIsLoading(true);

    userSeq = userSeq ? userSeq : session.user.userSeq;
    indexKey = session.indexKey;
    // console.log('++++++++++++++++++++++++');
    // console.log(data);
    // console.log('++++++++++++++++++++++++');
    // console.log(userInfos);
    // console.log('++++++++++++++++++++++++');
    // console.log(hsssessionid);
    // console.log('++++++++++++++++++++++++');
    const parameters = {
      ...userInfos,
      ...data,
      userSeq,
      type,
    };

    let result;
    if (session.isFirstlogin == true) {
      result = await apiCall(adminApi.updateUserfirstlogin, {
        parameters,
        hsssessionid: hsssessionid,
      });
    } else {
      result = await apiCall(adminApi.updateUserPassword, {
        parameters,
        hsssessionid: hsssessionid,
      });
    }

    setIsLoading(false);

    // console.log(result);
    if (result.status === 200) {
      if (result.data === 1) {
        openModal({
          // message: '비밀번호가 변경되었습니다.',
          message: intl.formatMessage({ id: 'user.password-change-success-msg' }),
          onConfirm: () => {
            closeModal(true);
            // setOpen(false);
          },
        });
      } else if (result.data === -1) {
        openModal({
          // message: '현재 비밀번호가 일치하지 않습니다.',
          message: intl.formatMessage({ id: 'user.password-current-not-match-msg' }),
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('loginPassword');
            }, 300);
          },
        });
      } else if (result.data === -2) {
        openModal({
          // message: '비밀번호 규칙을 다시 확인하시고 입력하여 주세요.',
          message: intl.formatMessage({ id: 'user.password-check-policy-msg' }),
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
      } else if (result.data === -3) {
        openModal({
          // message: '기존 비밀번호와 다른 비밀번호를 입력하세요.',
          message: intl.formatMessage({ id: 'user.password-difference-msg-2' }),
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
      } else {
        openModal({
          // message: '비밀번호 변경에 실패하였습니다.',
          message: intl.formatMessage({ id: 'user.password-change-fail-msg' }),
          onConfirm: () => {
            closeModal();
            // setOpen(false);
          },
        });
      }
    } else {
      openModal({
        // message: '비밀번호 변경에 실패하였습니다.',
        message: intl.formatMessage({ id: 'user.password-change-fail-msg' }),
        onConfirm: () => {
          closeModal();
          // setOpen(false);
        },
      });
    }
  };
  // 변경 데이터 저장
  const doSave = () => {
    if (methods.getValues('newPassword') !== methods.getValues('confirmPassword')) {
      openModal({
        // message: '신규 비밀번호와 일치하지 않습니다.',
        message: intl.formatMessage({ id: 'user.password-not-match-msg' }),
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('confirmPassword');
          }, 300);
        },
      });

      return;
    }

    openConfirmModal({
      // message: '비밀번호를 변경하시겠습니까?',
      message: intl.formatMessage({ id: 'user.password-confirm-msg' }),
      // confirmButtonText: '변경',
      confirmButtonText: intl.formatMessage({ id: 'common.btn-change' }),
      target: 'userPasswordChange',
      methods,
    });
  };
  // 닫기
  const closeModal = (result = false) => {
    // console.log('-----------------------');
    // console.log(session);
    // console.log('-----------------------');
    if (parent === 'emptyPage') {
      // push('/common/login');
      signOut({ callbackUrl: '/common/login' });
    } else {
      if (result) sessionUpdate({ isPasswordUpdate: true });
      setOpen(false);
    }
  };
  // JSX
  return (
    <PopUp
      // title="비밀번호 변경"
      title={intl.formatMessage({ id: 'user.password-change-title' })}
      alertOpen={open}
      closeAlert={closeModal}
      // closeAlert={setOpen}
      maxWidth="xs"
      fullWidth
      // confirmLabel="변경"
      confirmButtonText={intl.formatMessage({ id: 'common.btn-change' })}
      callBack={doSave}
      sx={
        type === 'others'
          ? {
              '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '500px',
                },
              },
            }
          : {}
      }
    >
      {isLoading && <Loader isGuard />}
      <FormProvider {...methods}>
        <form id="userPasswordChange" onSubmit={methods.handleSubmit(changeUserPassword)}>
          <GridItem
            container
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '200px', minWidth: '200px' },
              '.inputBox': { width: '100%' },
            }}
          >
            {userSeq && userSeq !== session.user.userSeq ? (
              <GridItem
                container
                divideColumn={1}
                borderFlag
                sx={{
                  '& .text': { maxWidth: '200px', minWidth: '200px' },
                  '.inputBox': { width: '100%' },
                }}
              >
                <Label
                  // label="사용자 ID"
                  label={intl.formatMessage({ id: 'user.id' })}
                  labelBackgroundFlag
                  data={userId}
                />
                <Label
                  // label="사용자명"
                  label={intl.formatMessage({ id: 'user.name' })}
                  labelBackgroundFlag
                  data={userName}
                />
              </GridItem>
            ) : null}
            {/* chrome 자동완성 방지 */}
            <input
              style={{ display: 'none' }}
              type="text"
              name="username"
              autoComplete="username"
            />
            {session.isFirstlogin === true && (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="text"
                // label="신규 ID"
                label={intl.formatMessage({ id: 'user.new-id' })}
                name="newUserId"
                // placeholder="신규 ID"
                autoComplete="new-id"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            )}
            {session.isFirstlogin === true && (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="text"
                // label="신규 ID 확인"
                label={intl.formatMessage({ id: 'user.confirm-id' })}
                name="confirmnewUserId"
                // placeholder="신규 ID 확인"
                autoComplete="new-id"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            )}
            {session.isFirstlogin === true && (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="password"
                // label="현재 PinCode"
                label={intl.formatMessage({ id: 'user.current-pin' })}
                name="loginPincode"
                // placeholder="현재 PinCode"
                autoComplete="login-pincode"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            )}
            {session.isFirstlogin === true && (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="password"
                // label="신규 PinCode"
                label={intl.formatMessage({ id: 'user.new-pin' })}
                name="newPincode"
                // placeholder="신규 PinCode"
                autoComplete="new-pincode"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            )}
            {session.isFirstlogin === true && (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="password"
                // label="신규 PinCode 확인"
                label={intl.formatMessage({ id: 'user.confirm-pin' })}
                name="confirmnewPincode"
                // placeholder="신규 Pincode 확인"
                autoComplete="new-pincode"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            )}
            {type === 'self' ? (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="password"
                // label="현재 비밀번호"
                label={intl.formatMessage({ id: 'user.current-password' })}
                name="loginPassword"
                // placeholder="현재 비밀번호"
                autoComplete="new-password"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            ) : (
              <LabelInput
                // label="패스워드 변경 방법"
                label={intl.formatMessage({ id: 'user.password-change-type' })}
                type="radio"
                labelBackgroundFlag
                name="tempPwdYn"
                list={[
                  {
                    // label: '직접입력',
                    label: intl.formatMessage({ id: 'user.password-directly' }),
                    value: 'N',
                  },
                  {
                    // label: '임시발급',
                    label: intl.formatMessage({ id: 'user.password-temporary' }),
                    value: 'Y',
                  },
                ]}
              />
            )}
            <BootstrapTooltip
              title={
                <>
                  <Typography variant="caption" display="block">
                    {/* <Info sx={{ fontSize: '1em' }} /> 최소 {passwordRules.pwdMinLen}자리 이상, 최대{' '} */}
                    {/* {passwordRules.pwdMaxLen}자리 이하 */}
                    <Info sx={{ fontSize: '1em' }} />{' '}
                    {intl.formatMessage(
                      { id: 'user.password-length-policy-msg' },
                      {
                        0: passwordRules.pwdMinLen,
                        1: passwordRules.pwdMaxLen,
                      },
                    )}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {/* <Info sx={{ fontSize: '1em' }} /> 영소문자 최소 {passwordRules.esMinLen} */}
                    {/* 자리 이상 */}
                    <Info sx={{ fontSize: '1em' }} />{' '}
                    {intl.formatMessage(
                      { id: 'user.password-lower-case-policy-msg' },
                      { 0: passwordRules.esMinLen },
                    )}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {/* <Info sx={{ fontSize: '1em' }} /> 영대문자 최소 {passwordRules.ebMinLen} */}
                    {/* 자리 이상 */}
                    <Info sx={{ fontSize: '1em' }} />{' '}
                    {intl.formatMessage(
                      { id: 'user.password-upper-case-policy-msg' },
                      { 0: passwordRules.ebMinLen },
                    )}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {/* <Info sx={{ fontSize: '1em' }} /> 숫자 최소 {passwordRules.numMinLen} */}
                    {/* 자리 이상, 특수문자 최소 {passwordRules.scMinLen}자리 이상 */}
                    <Info sx={{ fontSize: '1em' }} />{' '}
                    {intl.formatMessage(
                      { id: 'user.password-number-special-policy-msg' },
                      {
                        0: passwordRules.numMinLen,
                        1: passwordRules.scMinLen,
                      },
                    )}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {/* <Info sx={{ fontSize: '1em' }} /> {passwordRules.ccCntLimit}자리 이하 연속문자,{' '} */}
                    {/* {passwordRules.scCntLimit}자리 이하 동일문자 */}
                    <Info sx={{ fontSize: '1em' }} />{' '}
                    {intl.formatMessage(
                      { id: 'user.password-continue-same-policy-msg' },
                      {
                        0: passwordRules.ccCntLimit,
                        1: passwordRules.scCntLimit,
                      },
                    )}
                  </Typography>
                  {passwordRules.idPwdInId === 'Y' || passwordRules.idPwdInName === 'Y' ? (
                    <Typography variant="caption" display="block">
                      <Info sx={{ fontSize: '1em' }} />{' '}
                      {/* {passwordRules.idPwdInId === 'Y' ? '사용자 ID 포함 불가' : ''} */}
                      {passwordRules.idPwdInId === 'Y'
                        ? intl.formatMessage({ id: 'user.password-id-include-policy-msg' })
                        : ''}
                      {passwordRules.idPwdInId === 'Y' && passwordRules.idPwdInName === 'Y'
                        ? ', '
                        : ''}
                      {/* {passwordRules.idPwdInName === 'Y' ? '사용자명 포함 불가' : ''} */}
                      {passwordRules.idPwdInName === 'Y'
                        ? intl.formatMessage({ id: 'user.password-name-include-policy-msg' })
                        : ''}
                    </Typography>
                  ) : (
                    <></>
                  )}
                  <Typography variant="caption" display="block">
                    <Info sx={{ fontSize: '1em' }} /> {/* 현재 비밀번호 포함 불가 */}
                    {intl.formatMessage({
                      id: 'user.password-current-password-include-policy-msg',
                    })}
                  </Typography>
                </>
              }
              placement="bottom"
              disableFocusListener={!enabledFlag.newPassword}
              disableHoverListener={!enabledFlag.newPassword}
            >
              <LabelInput
                labelBackgroundFlag
                htmlType="password"
                // label="신규 비밀번호"
                label={intl.formatMessage({ id: 'user.new-password' })}
                name="newPassword"
                placeholder={
                  methods.watch('tempPwdYn') === 'Y'
                    ? // `${tempPasswordTypeString[passwordRules.idPwdTemp]}(으)로 임시발급`
                      // : '신규 비밀번호'
                      intl.formatMessage(
                        { id: 'user.password-temporary-msg' },
                        { method: tempPasswordTypeString[passwordRules.idPwdTemp] },
                      )
                    : intl.formatMessage({ id: 'user.login-password' })
                }
                autoComplete="new-password"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
                sx={
                  enabledFlag.newPassword
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
                required={enabledFlag.newPassword}
                disabled={!enabledFlag.newPassword}
              />
            </BootstrapTooltip>
            <LabelInput
              labelBackgroundFlag
              htmlType="password"
              // rules={{
              //   validate: (value) =>
              //     methods.getValues('newPassword') !== value
              //       ? '신규 비밀번호와 일치하지 않습니다.'
              //       : '',
              // }}
              // label="신규 비밀번호 확인"
              label={intl.formatMessage({ id: 'user.confirm-password' })}
              name="confirmPassword"
              placeholder={
                methods.watch('tempPwdYn') === 'Y'
                  ? // ? `${tempPasswordTypeString[passwordRules.idPwdTemp]}(으)로 임시발급`
                    // : '신규 비밀번호 확인'
                    intl.formatMessage(
                      { id: 'user.password-temporary-msg' },
                      { method: tempPasswordTypeString[passwordRules.idPwdTemp] },
                    )
                  : intl.formatMessage({ id: 'user.confirm-password' })
              }
              autoComplete="new-password"
              color={capsWarning ? 'warning' : 'primary'}
              onKeyDown={onKeyDown}
              helperText={
                capsWarning
                  ? // 'Caps Lock 켜짐'
                    intl.formatMessage({ id: 'common.caps-lock-warning' })
                  : ''
              }
              // helperText={
              //   capsWarning ? (
              //     <Typography variant="caption" sx={{ color: 'warning.main' }}>
              //       Caps Lock 켜짐
              //     </Typography>
              //   ) : (
              //     <></>
              //   )
              // }
              sx={
                enabledFlag.confirmPassword
                  ? null
                  : {
                      '& .MuiInputBase-input': {
                        backgroundColor: '#eeeeee',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        textFillColor: '#000000 !important',
                        fontWeight: 'bold',
                      },
                    }
              }
              required={enabledFlag.confirmPassword}
              disabled={!enabledFlag.confirmPassword}
            />
          </GridItem>
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default ChangePasswordModal;
