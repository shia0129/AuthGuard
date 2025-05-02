import GridItem from '@components/modules/grid/GridItem';
import { Button, Stack } from '@mui/material';

function IpPortInfoComponent({ ipPortData, name }) {
  const ipPortArray = ipPortData.split('|');

  return (
    <GridItem container divide={2}>
      {ipPortArray.map((item, index) => (
        <Stack key={index} direction="row" spacing={0.5} sx={{ padding: '5px' }}>
          <Button
            key={index}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor:
                name === 'destinationIp'
                  ? '#63a3c6'
                  : name === 'destinationPort'
                  ? '#707ab2'
                  : '#b387b4',
              maxHeight: '25px',
            }}
          >
            {item}
          </Button>
        </Stack>
      ))}
    </GridItem>
  );
}

export default IpPortInfoComponent;
