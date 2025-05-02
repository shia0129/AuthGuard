import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// project import
import MainLayout from './MainLayout';
import AuthGuard from '@modules/utils/route-guard/AuthGuard';
import GuestGuard from '@modules/utils/route-guard/GuestGuard';
// import GuestLoginGuard from '@modules/utils/route-guard/GuestLoginGuard';
import PopupLayout from './PopupLayout';

const Header = lazy(() => import('./Header'));
const FooterBlock = lazy(() => import('./FooterBlock'));

// ==============================|| Loader ||============================== //

const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2),
  },
}));

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

export default function Layout({ variant = 'main', children, title, isDashboard = false }) {
  if (variant === 'landing' || variant === 'simple') {
    return (
      <Suspense fallback={<Loader />}>
        <Header layout={variant} />
        {children}
        <FooterBlock isFull={variant === 'landing'} />
      </Suspense>
    );
  }

  if (variant === 'blank') {
    return children;
  }

  if (variant === 'auth') {
    return <GuestGuard>{children}</GuestGuard>;
  }

  if (variant === 'popup') {
    return (
      <AuthGuard>
        <PopupLayout title={title} isDashboard={isDashboard}>
          {children}
        </PopupLayout>
      </AuthGuard>
    );
  }

  if (variant === 'monPopup') {
    return (
      <AuthGuard>
        {/* <MonPopupLayout title={title}>{children}</MonPopupLayout> */}
        {children}
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
};
