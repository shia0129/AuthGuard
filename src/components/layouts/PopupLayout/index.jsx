import Image from 'next/image';

// Project import
import largeBlackHanssak from '@public/images/logo.svg';
import GridItem from '@components/modules/grid/GridItem';

// MUI
import { Box, Typography } from '@mui/material';
const myLoader = ({ src }) => {
  return src; // 정적 경로 그대로 반환
};
function PopupLayout({ children, title, isDashboard }) {
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column' }}>
      <GridItem
        container
        direction="row"
        directionHorizon="space-between"
        directionVertical="center"
        sx={{ bgcolor: '#1E232E' }}
      >
        <GridItem item>
          <Typography sx={{ ml: 5 }} variant="title2" color="white">
            {title}
          </Typography>
        </GridItem>
        <GridItem item sx={{ display: 'flex', height: '47px', alignItems: 'center' }}>
          <Image
            loader={myLoader}
            unoptimized
            src={largeBlackHanssak}
            alt="Hanssak"
            width={200}
            height={40}
          />
        </GridItem>
      </GridItem>

      <Box sx={{ ...(!isDashboard && { m: 3 }) }}>{children}</Box>
    </Box>
  );
}

export default PopupLayout;
