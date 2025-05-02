'use client';

import { useState, useEffect, useRef } from 'react';
import { SessionProvider } from 'next-auth/react';
import { PageLoader } from '@components/modules/common/Spinner';

export default function NextAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current) {
        useEffect_0001.current = true;
        return;
      }
    }
    fetch('/api/auth/session', {
      credentials: 'include', // 쿠키 기반 인증이라면 포함시키기
    })
      .then((res) => {
        // console.log(res);
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('세션 정보를 가져오는 중 오류 발생:', err);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <PageLoader open={true} />; // 로딩 상태 처리
  }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
