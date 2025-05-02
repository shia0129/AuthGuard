// material-ui
import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

// ==============================|| Loader ||============================== //

const Loader = ({ isGuard = false, msg = null}) => {
  const loading = useSelector((state) => state.loader.loading);

  if ((isGuard && !loading) || (!isGuard && loading))
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 5 ,
          display: 'flex',
          flexDirection: 'column', // 세로로 배치
          alignItems: 'center', // 가운데 정렬
          justifyContent: 'center',
        }}
        open={isGuard ? isGuard : loading}
      >
        <CircularProgress color="inherit" size={65} disableShrink />
        {msg && <p>{msg}</p>}
      </Backdrop>
    );
  else return null;
};

export default Loader;
