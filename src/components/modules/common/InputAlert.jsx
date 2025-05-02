import { Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function InputAlert({ className, sx, children }) {
  const theme = useTheme();

  return (
    <Alert
      sx={{
        position: 'absolute',
        width: '210px !important',
        transform: 'translateY(85%)',
        zIndex: 999,
        background: 'rgb(0 0 0 / 70%)',
        color: theme.palette.grey[0],
        '&::after': {
          content: "''",
          border: '10px solid transparent',
          borderBottom: '10px solid rgb(0 0 0 / 70%)',
          left: '20px',
          top: '-20px',
          position: 'absolute',
        },
        '& .MuiAlert-icon': {
          color: '#fff !important',
        },
        ...sx,
      }}
      severity="warning"
      className={className || 'alertBox'}
    >
      <strong>{children}</strong>
    </Alert>
  );
}

export default InputAlert;
