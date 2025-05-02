// Project import
import GridItem from '@components/modules/grid/GridItem';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';

// MUI
import { Box, Typography } from '@mui/material';

function MonPopupLayout({ children, title }) {
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
        <GridItem item sx={{ mr: 10, mt: 1 }}>
          <VolumeUpOutlinedIcon
            style={{ color: '#fff', fontSize: '30px', cursor: 'pointer' }}
            onClick={() => {
              alert(1);
            }}
          />
          {/* <Image src={largeBlackHanssak} alt="Hanssak" width={200} height={40} /> */}
        </GridItem>
      </GridItem>

      {children}
    </Box>
  );
}

export default MonPopupLayout;
