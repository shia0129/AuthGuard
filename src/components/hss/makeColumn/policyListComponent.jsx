import GridItem from '@components/modules/grid/GridItem';
import { Button, Stack } from '@mui/material';

function PolicyListComponent({ data }) {
  const dataArray = data ?? [];

  return (
    <GridItem container divide={2}>
      {dataArray.length > 0 &&
        dataArray.map((item) => (
          <Stack key={item.id} direction="row" spacing={0.5} sx={{ padding: '5px' }}>
            <Button
              key={item.id}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#63a3c6',
                maxHeight: '25px',
                pointerEvents: 'none', // 클릭 방지
                textTransform: 'none', // 대문자 변환 방지
              }}
            >
              {item.name}
            </Button>
          </Stack>
        ))}
    </GridItem>
  );
}

export default PolicyListComponent;
