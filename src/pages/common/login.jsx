// React, Next
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CryptoJS from 'crypto-js';

// project import
import Page from '@components/mantis/Page';
import AuthWrapper from '@components/auth/AuthWrapper';
import Layout from '@components/layouts';
import AnimateButton from '@components/@extended/AnimateButton';
import GridItem from '@components/modules/grid/GridItem';
import LabelInput from '@components/modules/input/LabelInput';
import commonApi from '@api/common/commonApi';
import useApi from '@modules/hooks/useApi';
const hanssak = '/assets/images/logo/logoColor-t.svg';

// mui
import { Button, InputAdornment, Box, CircularProgress } from '@mui/material';
import { LockOutlined, UserOutlined, CodeOutlined } from '@ant-design/icons';

// third-party
import { FormProvider, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import forge from 'node-forge';
import { browserName } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTopMenu } from '@modules/redux/reducers/menu';
import { useIntl } from 'react-intl';

const loginInputStyles = {
  minWidth: '100%',
  borderRadius: '4px',
  backgroundColor: '#5b5b69',
  '& fieldset': { border: '0' },
  input: { color: '#bbcff0', fontSize: '15px', fontWeight: 'bolder' },
};
const generateRandomKey = (length = 32) => {
  const randomString = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex); // 16바이트의 랜덤 문자열 생성
  return randomString.substring(0, length); // 길이에 맞게 자르기
};
function Login() {
  const dispatch = useDispatch();
  const intl = useIntl();

  const methods = useForm({
    defaultValues: {
      userId: 'hssmanager',
      userPassword: 'Hsck@2301!',
      pincode: '1234567',
    },
  });

  const { selectedTopMenu } = useSelector((state) => state.menu);

  // api 호출 함수, openModal 함수.
  const [apiCall, openModal] = useApi();

  // 로딩 관련 상태
  const [isLoading, setIsLoading] = useState(false);

  const useEffect_0001 = useRef(false);
  // 상단 메뉴 선택값 초기화
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    if (selectedTopMenu) {
      dispatch(setSelectedTopMenu({ selectedTopMenu: null }));
    }
  }, [selectedTopMenu]);

  // 로그인 요청 함수.
  const doLogin = async (data) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    // 로그인 실패
    const defaultLoginFailMessage = intl.formatMessage({ id: 'common.login-msg-fail-label' });

    try {
      const { userId, userPassword, pincode } = data;
      const hsssessionid = generateRandomKey(32);

      // 사용자 입력 비밀번호 RSA 암호화.
      const rsaResult = await apiCall(commonApi.getRsaKey, { userId });

      if (rsaResult.status !== 200) {
        // throw new Error('RSA 키 요청 실패');
        throw new Error();
      }

      const { rsaPublicKey, indexKey } = rsaResult.data;
      // RSA Public Key .pem 포맷.
      const rsaKey = `-----BEGIN PUBLIC KEY-----\n${rsaPublicKey}\n-----END PUBLIC KEY-----`;

      // 추가 인증 과정에서 세션에 저장하기 위한 값.
      sessionStorage.setItem('authParam', JSON.stringify({ indexKey, rsaKey }));

      // 로그인 요청
      /*
      const authResult = await signIn(
        'authorization',
        {
          userId,
          userPassword: forge.util.encode64(
            forge.pki.publicKeyFromPem(rsaKey).encrypt(encodeURIComponent(String(userPassword))),
          ),
          pincode,
          hsssessionid,
          browserName: `${browserName}`,
          indexKey,
          redirect: false,
        },
        {
          indexKey,
          rsaKey,
        },
      );
      */
      let authResult;

      try {
        authResult = await signIn('authorization', {
          userId,
          userPassword: forge.util.encode64(
            forge.pki.publicKeyFromPem(rsaKey).encrypt(encodeURIComponent(String(userPassword))),
          ),
          pincode,
          hsssessionid,
          browserName: `${browserName}`,
          indexKey,
          redirect: false,
        });
      } catch (signInError) {
        setIsLoading(false);
        openModal({ message: defaultLoginFailMessage });
        return;
      }

      // 사용자 인증 성공 시 처리.
      if (authResult.status === 200 && authResult.ok) {
        setIsLoading(false);
        sessionStorage.removeItem('authParam');
        return;
      }

      // 로그인 실패 처리.
      let message = defaultLoginFailMessage;
      if (authResult?.error) {
        try {
          const response = JSON.parse(authResult.error);
          message = response.errors?.message || defaultLoginFailMessage;
        } catch (parseError) {
          message = defaultLoginFailMessage;
        }
      }

      openModal({ message });
    } catch (error) {
      openModal({
        message: error.message || defaultLoginFailMessage,
      });
    }
    setIsLoading(false);
  };
  const myLoader = ({ src }) => {
    return src; // 정적 경로 그대로 반환
  };
  return (
    <Page title="Login" className="loginBox">
      <AuthWrapper>
        {/* admin */}
        <GridItem container direction="row" sx={{ justifyContent: 'center' }}>
          <Image
            loader={myLoader}
            src={hanssak}
            alt="Hanssak"
            className="logoImg"
            width={200}
            height={75}
          />
        </GridItem>
        <GridItem sx={{ marginTop: '15px' }}>
          <FormProvider {...methods} type="auth">
            <form onSubmit={methods.handleSubmit(doLogin)}>
              <GridItem>
                <GridItem sx={{ mt: 2 }}>
                  <LabelInput
                    name="userId"
                    size="medium"
                    sx={loginInputStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            mr: -0.5,
                            color: '#bbcff0',
                            fontSize: '18px',
                          }}
                        >
                          <UserOutlined sx={{}} />
                        </InputAdornment>
                      ),
                    }}
                    autoComplete="username"
                  />
                </GridItem>
                <GridItem sx={{ mt: 2 }}>
                  <LabelInput
                    sx={loginInputStyles}
                    size="medium"
                    name="userPassword"
                    htmlType="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            mr: -0.5,
                            color: '#bbcff0',
                            fontSize: '18px',
                          }}
                        >
                          <LockOutlined />
                        </InputAdornment>
                      ),
                    }}
                    autoComplete="new-password"
                  />
                </GridItem>
                <GridItem sx={{ mt: 2 }}>
                  <LabelInput
                    sx={loginInputStyles}
                    size="medium"
                    name="pincode"
                    htmlType="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            mr: -0.5,
                            color: '#bbcff0',
                            fontSize: '18px',
                          }}
                        >
                          <CodeOutlined />
                        </InputAdornment>
                      ),
                    }}
                    autoComplete="new-password"
                  />
                </GridItem>
                <GridItem sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        maxHeight: '42px',
                        minWidth: 400,
                        fontSize: '15px',
                        fontWeight: 'bolder',
                        lineHeight: '50px',
                      }}
                    >
                      {
                        //title="로그인"
                        intl.formatMessage({ id: 'common.login' })
                      }
                    </Button>
                  </AnimateButton>
                </GridItem>
              </GridItem>
            </form>
          </FormProvider>
        </GridItem>
      </AuthWrapper>
      <Box
        sx={{
          display: isLoading ? 'flex' : 'none',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.23)',
          zIndex: 99999,
        }}
      >
        <CircularProgress />
      </Box>
    </Page>
  );
}

Login.getLayout = function getLayout(page) {
  return <Layout variant="auth">{page}</Layout>;
};

export default Login;
