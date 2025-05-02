import { Button, Stack } from '@mui/material';

function StatusTypeComponent({ statusType, id, handleClickStatusType }) {
  return (
    <Stack direction="column" alignItems="center">
      <Button
        variant="outlined"
        onClick={() => handleClickStatusType(statusType, id)}
        sx={{
          width: '80px',
          background: statusType === '0' && '#b9565b',
          color: statusType === '0' && '#fff',
          height: '20px',
        }}
      >
        {statusType === '1' ? 'START' : 'STOP'}
      </Button>
    </Stack>
  );
}

export default StatusTypeComponent;
