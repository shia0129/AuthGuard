import PropTypes from 'prop-types';
import { useEffect,useRef } from 'react';

// next
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// types
import Loader from '@components/mantis/Loader';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    if(!session){
      return;
    }
    const fetchData = async () => {
      const res = await fetch('/api/auth/protected');
      const json = await res.json();

      if (!session?.accessToken || !json.protected) {
        router.push('/common/login');
        return;
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [session]);

  if (status === 'loading' || !session?.accessToken) return <Loader isGuard />;

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
