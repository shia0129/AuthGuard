import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { useSession, signOut } from 'next-auth/react';
import useModal from '@modules/hooks/useModal';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useTimerControl } from '@modules/hooks/useTimerControl';
import { useLogoutFlag } from '@modules/contexts/LogoutContext';

const RECONNECT_INTERVAL_MS = 1000; // 재연결 간격 (1초)
const AUTO_SIGNOUT_TIMEOUT_MS = 10000; // 모달 뜬 뒤 자동 로그아웃 대기시간 (10초)

const Timer = () => {
  const [serverTime, setServerTime] = useState(dayjs('1979-07-08'));
  const { data: session } = useSession();
  const openModal = useModal();
  const intl = useIntl();
  const router = useRouter();
  const { connectSSE, disconnectSSE } = useTimerControl();
  const isLoggingOut = useLogoutFlag();

  const getErrorMessage = (error) => {
    const status = error?.status;

    if (
      status === 401 ||
      error?.code === 'expiredException' ||
      error?.message?.includes('JWT expired')
    ) {
      // 토큰이 만료되었습니다.
      return intl.formatMessage({ id: 'common.token-msg-expired' });
    }

    if (status === 403) {
      // 접근 권한이 없습니다.
      return intl.formatMessage({ id: 'common.forbidden-msg' });
    }

    if (status === 500) {
      // 일시적인 서버 오류가 발생했습니다.
      return intl.formatMessage({ id: 'common.server-msg-error' });
    }

    // 예기치 못한 오류가 발생했습니다. 관리자에게 문의해주세요.
    return intl.formatMessage({ id: 'common.unknown-msg-error' });
  };

  const onOpen = () => {};
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.data || event);
      const { server_date: serverDate } = data.attribute;
      setServerTime(dayjs(serverDate));
    } catch (error) {
      console.error('서버 시간 데이터 파싱 오류:', error);
      disconnectSSE();
      startReconnectLoop(); // 파싱 실패도 재연결 시도
    }
  };

  const onError = (error) => {
    console.error('SSE 연결 오류:', error);

    if (isLoggingOut.current) {
      // console.log('로그아웃 중으로 SSE 에러 무시');
      return;
    }

    disconnectSSE();

    if (!session) {
      return;
    }

    const status = error?.status;
    if (status === 500) {
      router.replace('/serverError');
      signOut({ callbackUrl: '/common/login' });
      return;
    }
    const isSessionExpired =
      status === 401 ||
      status === 403 ||
      error?.code === 'expiredException' ||
      error?.message?.includes('JWT expired');
    if (isSessionExpired) {
      // 세션이 존재하면 모달 띄우기 (즉, 강제 로그아웃 당했을 때)
      console.log(session);
      openModal({
        message: getErrorMessage(error),
        type: 'error',
        onConfirm: () => {
          signOut({ callbackUrl: '/common/login' });
        },
        close: false,
      });
      setTimeout(() => signOut({ callbackUrl: '/common/login' }), AUTO_SIGNOUT_TIMEOUT_MS);
      return;
    }

    startReconnectLoop();
  };

  const startReconnectLoop = () => {
    setTimeout(() => {
      if (navigator.onLine && session) {
        connectSSE(session, onOpen, onMessage, onError);
      }
    }, RECONNECT_INTERVAL_MS);
  };

  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }

    if (session?.user?.hsssessionid && session?.accessToken) {
      connectSSE(session, onOpen, onMessage, onError);
    }

    return () => {
      disconnectSSE();
    };
  }, [session]);

  return (
    <div style={{ width: '300px', textAlign: 'center', color: 'black', fontSize: '0.9em' }}>
      {serverTime.format('YYYY/MM/DD hh:mm:ss A')}
    </div>
  );
};

export default Timer;
