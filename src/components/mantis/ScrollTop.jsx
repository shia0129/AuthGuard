import PropTypes from 'prop-types';
import { useEffect,useRef } from 'react';
import { useRouter } from 'next/router';

// ==============================|| NAVIGATION - SCROLL TO TOP ||============================== //

const ScrollTop = ({ children }) => {
  const location = useRouter();
  const { pathname } = location;
  const useEffect_0001 = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {  //process.env.NODE_ENV === 'development'
      if (!useEffect_0001.current){
        useEffect_0001.current = true;
        return; 
      } 
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return children || null;
};

ScrollTop.propTypes = {
  children: PropTypes.node,
};

export default ScrollTop;
