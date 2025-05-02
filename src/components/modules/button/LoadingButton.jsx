'use client'; // ✅ Ensures Next.js 15 client compatibility

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// Material-UI
import { Button } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

const getColors = (theme, color) => {
  switch (color) {
    case 'secondary':
      return theme.palette.secondary;
    case 'error':
      return theme.palette.error;
    case 'warning':
      return theme.palette.warning;
    case 'info':
      return theme.palette.info;
    case 'success':
      return theme.palette.success;
    default:
      return theme.palette.primary;
  }
};

// ==============================|| STYLED - LOADING BUTTON ||============================== //

const LoadingButtonStyle = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'shape' && prop !== 'variant',
})(({ theme, variant, shape, color, loading, loadingPosition }) => {
  const colors = getColors(theme, color);
  const { main, dark, contrastText } = colors;

  return {
    position: 'relative',
    '::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      borderRadius: shape === 'rounded' ? '50%' : 4,
      opacity: 0,
      transition: 'all 0.5s',
    },
    ':active::after': {
      opacity: 1,
      transition: '0s',
    },

    ...(variant === 'contained' && {
      backgroundColor: main,
      color: contrastText,
      '&:hover': {
        backgroundColor: dark,
      },
    }),

    ...(variant === 'outlined' && {
      border: `1px solid ${main}`,
      color: main,
    }),

    ...(variant === 'text' && {
      color: main,
    }),

    ...(loading && {
      color: '#fff',
      '& .MuiLoadingButton-loadingIndicator': {
        color: contrastText,
      },
    }),

    ...(shape && {
      minWidth: 0,
      width: shape === 'rounded' ? 36 : 'auto',
      height: shape === 'rounded' ? 36 : 'auto',
      borderRadius: shape === 'rounded' ? '50%' : 4,
    }),
  };
});

// ==============================|| EXTENDED - LOADING BUTTON ||============================== //

const LoadingButton = forwardRef(({ variant = 'text', shape, children, color = 'primary', ...others }, ref) => {
  const theme = useTheme(); // ✅ Correctly use MUI theme without passing as a prop

  return (
    <LoadingButtonStyle ref={ref} variant={variant} shape={shape} color={color} {...others}>
      {children}
    </LoadingButtonStyle>
  );
});

LoadingButton.propTypes = {
  variant: PropTypes.string,
  shape: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
};

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
