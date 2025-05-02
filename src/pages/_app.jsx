'use client';

import Head from 'next/head';
import { Provider } from 'react-redux';
import { wrapper } from '@modules/redux'; // store 생성 관련 코드가 포함된 파일에서 가져오기
import { PersistGate } from 'redux-persist/integration/react';
import { SessionProvider } from 'next-auth/react';
import NextAuthProvider from '@modules/utils/NextAuthProvider';
import { ConfigProvider } from '@modules/contexts/ConfigContext';
import ThemeCustomization from '@modules/themes';
import ScrollTop from '@components/mantis/ScrollTop';
import Snackbar from '@components/@extended/Snackbar';
import Alert from '@components/modules/common/Alert';
import ConfirmAlert from '@components/modules/common/ConfirmAlert';
import { useEffect, useRef } from 'react';
import Loader from '@components/mantis/Loader';
import CustomModal from '@components/modules/common/CustomModal';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Locales from '@components/Locales';
import 'simplebar-react/dist/simplebar.min.css';
import 'overlayscrollbars/overlayscrollbars.css';
import '@styles/common.css';
import 'moment/locale/ko';

import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { LogoutProvider } from '@modules/contexts/LogoutContext';

const theme = createTheme();
function App({ Component, pageProps }) {
  const session = pageProps?.session ?? null;
  // wrapper.useWrappedStore()를 통해 store와 persistor 가져오기
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const getLayout = Component.getLayout ?? ((page) => page);
  const useEffect_0001 = useRef(false);
  const useEffect_0002 = useRef(false);
  const useEffect_0003 = useRef(false);
  const useEffect_0004 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    const addLicense5 = async () => {
      const am5 = await import('@amcharts/amcharts5').then((mod) => mod);
      am5.addLicense('AM5C352517415');
    };
    addLicense5();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0002.current) {
        useEffect_0002.current = true;
        return;
      }
    }
    const addLicense4 = async () => {
      const am4core = await import('@amcharts/amcharts4/core').then((mod) => mod);

      am4core.addLicense('CH352517415');
      am4core.options.commercialLicense = true;
      // chart auto 해제 설정.
      am4core.options.autoDispose = true;
    };
    addLicense4();
  }, []);

  return (
    <NextAuthProvider session={session}>
      <Provider store={store}>
        <PersistGate persistor={store.__persistor} loading={null}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ThemeCustomization>
                <LogoutProvider>
                  <ConfigProvider>
                    <Locales>
                      <ScrollTop>
                        <LocalizationProvider
                          dateAdapter={AdapterMoment}
                          adapterLocale="ko"
                          localeText={{
                            cancelButtonLabel: '취소',
                            okButtonLabel: '확인',
                          }}
                        >
                          <Head>
                            <title>AuthGuard</title>
                            <link rel="icon" href="/favicon.ico" />
                          </Head>
                          <Snackbar />
                          <Alert />
                          <Loader />
                          <ConfirmAlert />
                          <CustomModal />
                          {getLayout(<Component {...props.pageProps} />)}
                        </LocalizationProvider>
                      </ScrollTop>
                    </Locales>
                  </ConfigProvider>
                </LogoutProvider>
              </ThemeCustomization>
            </ThemeProvider>
          </StyledEngineProvider>
        </PersistGate>
      </Provider>
    </NextAuthProvider>
  );
}

export default App;
