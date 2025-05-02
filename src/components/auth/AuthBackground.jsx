// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//import Image from 'next/image';
//import backImage from '@public/images/bg-2.jpg';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box className="loginBack">
      {/* <Image src={backImage} alt="backgroundImage" className="backImg" /> */}
    </Box>
  );
};

export default AuthBackground;
