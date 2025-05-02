import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { Stack, Typography } from '@mui/material';

function BoundTypeComponent({ boundType }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: '0 15px' }}
    >
      <Typography variant="h6">{boundType}</Typography>
      {boundType === 'IN_BOUND' ? (
        <LeftCircleFilled style={{ fontSize: '17px', color: '#f09545' }} />
      ) : (
        <RightCircleFilled style={{ fontSize: '17px', color: '#75c29d' }} />
      )}
    </Stack>
  );
}

export default BoundTypeComponent;
