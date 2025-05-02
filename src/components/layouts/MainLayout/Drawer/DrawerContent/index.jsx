import { useSelector } from 'react-redux';

// material-uiuseTheme
import { useMediaQuery } from '@mui/material';

// project import
import Navigation from './Navigation';
import SimpleBar from '@components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Navigation />
    </SimpleBar>
  );
};

export default DrawerContent;
