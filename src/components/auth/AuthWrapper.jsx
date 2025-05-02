import PropTypes from 'prop-types';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import AuthCard from '@components/auth/AuthCard';
import AuthBackground from '@components/auth/AuthBackground';
import AuthFooter from '@components/auth/AuthFooter';
// import Image from 'next/image';
// import hanssak from '@public/images/logo.svg';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //
const myLoader = ({ src }) => {
  return src; // 정적 경로 그대로 반환
};
const AuthWrapper = ({ children }) => (
  <Box sx={{ minHeight: '100vh' }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: '80vh',
      }}
    >
      {/* <Grid item xs={12} sx={{ ml: 3 }}>
        <Image loader={myLoader} src={hanssak} alt="Hanssak" width={140} height={60} />
      </Grid> */}
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: {
              xs: 'calc(100vh - 210px)',
              sm: 'calc(100vh - 134px)',
              md: 'calc(100vh - 112px)',
            },
          }}
        >
          <Grid item>
            <AuthCard>{children}</AuthCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthWrapper;
