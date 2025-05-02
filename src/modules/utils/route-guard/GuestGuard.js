import PropTypes from 'prop-types';
import { useEffect,useRef } from 'react';

// next
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

// types
import Loader from '@components/mantis/Loader';
import useApi from '@modules/hooks/useApi';

// import { AuthInstance } from '@modules/axios';
// import HsLib from '@modules/common/HsLib';
// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { data: session, status } = useSession();
  const [apiCall, openModal] = useApi();

  const { push } = useRouter();

  // Axios 인트턴스(Http통신)
  // const { instance } = AuthInstance();

  const logout = () => {
    signOut({ callbackUrl: '/common/login' });
  };
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }

    const fetchData = async () => {
      const res = await fetch('/api/auth/protected');
      const json = await res.json();
      if (json.protected && session) {
        // 테이블, 컬럼정보 요청
        // const gridInfo = await HsLib.getGridInfo('RoleList', roleApi);

        if (!session.isPasswordUpdate) {
          push('/common/emptyPage');
        } else if (session.user.firstPage !== null) {
          push(session.user.firstPage);
        } else {
          // 로그인한 사용자가 지정된 첫 페이지가 없는경우
          openModal({
            message: '지정된 첫 페이지가 없습니다.',
            onConfirm: logout,
          });
        }
      }
    };
    fetchData();

    // eslint-disable-next-line
  }, [session]);

  if (session?.provider === 'keycloakAuthentication') {
    sessionStorage.setItem('keycloakAuthParam', JSON.stringify({ otpFlag: true }));
  }

  if (status === 'loading' || session?.accessToken) return <Loader />;

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
