import { Button, Stack } from '@mui/material';

function EnabledTypeComponent({ enabledType, id, handleClickEnabledType }) {
  return (
    <Stack direction="column" spacing={0.5} alignItems="center" sx={{ padding: '5px' }}>
      <Button
        variant="outlined"
        onClick={() => handleClickEnabledType(enabledType, id)}
        sx={{
          width: '60px',
          background: enabledType === 'DISABLED' && '#b9565b',
          color: enabledType === 'DISABLED' && '#fff',
        }}
      >
        {enabledType === 'ENABLED' ? 'ON' : 'OFF'}
      </Button>
    </Stack>
  );
}

export default EnabledTypeComponent;
