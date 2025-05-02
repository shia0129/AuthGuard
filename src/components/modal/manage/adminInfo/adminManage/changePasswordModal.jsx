// libraries
import { AuthInstance } from '@modules/axios';
import { useState,useRef } from 'react';
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
import ButtonSet from '@components/modules/button/ButtonSet';
import GridItem from '@components/modules/grid/GridItem';
import Label from '@components/modules/label/Label';
// functions
import HsLib from '@modules/common/HsLib';
import useConfirmModal from '@modules/hooks/useConfirmModal';
import useApi from '@modules/hooks/useApi';
import adminApi from '@api/system/adminApi';
import preferencesApi from '@api/system/preferencesApi';

const initialForm = {
  loginPassword: '',
  newPassword: '',
  confirmPassword: '',
  tempPwdYn: 'N',
};

const enabledFormList = {
  tempPwdYn: {
    newPassword: ['N'],
    confirmPassword: ['N'],
  },
};

const tempPasswordTypeString = {
  1: '휴대전화',
  2: '이메일',
  3: '사용자 ID',
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
  }, [open]);
  // Side effect Hook
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current){
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
    // 패스워드 규칙 요청
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
    const userInfosDetail = await apiCall(
      adminApi.getAdminListDetail,
      userSeq ? userSeq : session.user.userSeq,
    );
    if (userInfosDetail.status === 200) {
      setUserInfos((prev) => ({
        ...prev,
        ...userInfosDetail.data,
      }));
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
    if (data.tempPwdYn === 'N') {
      if (data.loginPassword === data.newPassword) {
        openModal({
          message: '신규 비밀번호는 현재 비밀번호와 다르게 변경해야 합니다.',
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
          message: '신규 비밀번호는 현재 비밀번호를 포함하면 안됩니다.',
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
        return;
      }
    }
    // if (str.includes('Hello')) {
    //   console.log('exist Hello');
    // }

    if (
      data.tempPwdYn === 'N' &&
      !HsLib.isValidPassword(data.newPassword, passwordRules, userInfos.userId, userInfos.userName)
    ) {
      openModal({
        message: '비밀번호 규칙을 다시 확인하시고 입력하여 주세요.',
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('newPassword');
          }, 300);
        },
      });

      return;
    }

    userSeq = userSeq ? userSeq : session.user.userSeq;
    indexKey = session.indexKey;

    const parameters = {
      ...userInfos,
      ...data,
      userSeq,
      type,
    };

    const result = await apiCall(adminApi.updateUserPassword, parameters);

    if (result.status === 200) {
      if (result.data === 1) {
        openModal({
          message: '비밀번호가 변경되었습니다.',
          onConfirm: () => {
            closeModal(true);
            // setOpen(false);
          },
        });
      } else if (result.data === -1) {
        openModal({
          message: '현재 비밀번호가 일치하지 않습니다.',
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('loginPassword');
            }, 300);
          },
        });
      } else if (result.data === -2) {
        openModal({
          message: '비밀번호 규칙을 다시 확인하시고 입력하여 주세요.',
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
      } else if (result.data === -3) {
        openModal({
          message: '기존 비밀번호와 다른 비밀번호를 입력하세요.',
          onConfirm: () => {
            setTimeout(() => {
              methods.setFocus('newPassword');
            }, 300);
          },
        });
      } else {
        openModal({
          message: '비밀번호 변경에 실패하였습니다.',
          onConfirm: () => {
            closeModal();
            // setOpen(false);
          },
        });
      }
    } else {
      openModal({
        message: '비밀번호 변경에 실패하였습니다.',
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
        message: '신규 비밀번호와 일치하지 않습니다.',
        onConfirm: () => {
          setTimeout(() => {
            methods.setFocus('confirmPassword');
          }, 300);
        },
      });

      return;
    }

    openConfirmModal({
      message: '비밀번호를 변경하시겠습니까?',
      confirmButtonText: '변경',
      target: 'userPasswordChange',
      methods,
    });
  };
  // 닫기
  const closeModal = (result = false) => {
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
      title="비밀번호 변경"
      alertOpen={open}
      closeAlert={closeModal}
      // closeAlert={setOpen}
      maxWidth="xs"
      fullWidth
      disableCancel
      disableConfirm
      sx={
        type === 'others'
          ? {
              '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '450px',
                },
              },
            }
          : {}
      }
    >
      <FormProvider {...methods}>
        <form id="userPasswordChange" onSubmit={methods.handleSubmit(changeUserPassword)}>
          <GridItem
            container
            divideColumn={1}
            borderFlag
            sx={{
              '& .text': { maxWidth: '180px', minWidth: '180px' },
              '.inputBox': { width: '100%' },
            }}
          >
            {userSeq && userSeq !== session.user.userSeq ? (
              <GridItem
                container
                divideColumn={1}
                borderFlag
                sx={{
                  '& .text': { maxWidth: '180px', minWidth: '180px' },
                  '.inputBox': { width: '100%' },
                }}
              >
                <Label label="사용자 ID" labelBackgroundFlag data={userId} />
                <Label label="사용자명" labelBackgroundFlag data={userName} />
              </GridItem>
            ) : null}
            {/* chrome 자동완성 방지 */}
            <input style={{ display: 'none' }} type="text" />
            {type === 'self' ? (
              <LabelInput
                required
                labelBackgroundFlag
                htmlType="password"
                label="현재 비밀번호"
                name="loginPassword"
                placeholder="현재 비밀번호"
                autoComplete="new-password"
                color={capsWarning ? 'warning' : 'primary'}
                onKeyDown={onKeyDown}
              />
            ) : (
              <LabelInput
                label="패스워드 변경 방법"
                type="radio"
                labelBackgroundFlag
                name="tempPwdYn"
                list={[
                  {
                    label: '직접입력',
                    value: 'N',
                  },
                  {
                    label: '임시발급',
                    value: 'Y',
                  },
                ]}
              />
            )}
            <BootstrapTooltip
              title={
                <>
                  <Typography variant="caption" display="block">
                    <Info sx={{ fontSize: '1em' }} /> 최소 {passwordRules.pwdMinLen}자리 이상, 최대{' '}
                    {passwordRules.pwdMaxLen}자리 이하
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
                    <Info sx={{ fontSize: '1em' }} /> {passwordRules.ccCntLimit}자리 이하 연속문자,{' '}
                    {passwordRules.scCntLimit}자리 이하 동일문자
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
                  <Typography variant="caption" display="block">
                    <Info sx={{ fontSize: '1em' }} /> 현재 비밀번호 포함 불가
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
                label="신규 비밀번호"
                name="newPassword"
                placeholder={
                  methods.watch('tempPwdYn') === 'Y'
                    ? `${tempPasswordTypeString[passwordRules.idPwdTemp]}(으)로 임시발급`
                    : '신규 비밀번호'
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
              label="신규 비밀번호 확인"
              name="confirmPassword"
              placeholder={
                methods.watch('tempPwdYn') === 'Y'
                  ? `${tempPasswordTypeString[passwordRules.idPwdTemp]}(으)로 임시발급`
                  : '신규 비밀번호 확인'
              }
              autoComplete="new-password"
              color={capsWarning ? 'warning' : 'primary'}
              onKeyDown={onKeyDown}
              helperText={capsWarning ? 'Caps Lock 켜짐' : ''}
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
          <ButtonSet
            sx={{ mt: 4, justifyContent: 'right' }}
            options={[
              {
                label: '변경',
                callBack: doSave,
              },
              {
                label: '취소',
                callBack: () => {
                  closeModal();
                  // setOpen(false);
                },
              },
            ]}
          />
        </form>
      </FormProvider>
    </PopUp>
  );
}

export default ChangePasswordModal;
