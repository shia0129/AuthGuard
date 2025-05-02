import { Stack } from '@mui/material';
import dynamic from 'next/dynamic';

const XYChart5_tmp = dynamic(() => import('@components/third-party/am-chart/5/XYChart5_tmp'), {
  ssr: false,
});

const sampleData = [
  { date: '2024-01-31T13:02:49.721Z', value1: 0.5, value2: 0.8, value3: 1 },
  { date: '2024-02-01T13:02:49.721Z', value1: 1, value2: 0.1, value3: 0.5 },
  { date: '2024-02-02T13:02:49.721Z', value1: 1, value2: 0.5, value3: 1 },
  { date: '2024-02-03T13:02:49.721Z', value1: 0.3, value2: 0.7, value3: 0.5 },
  { date: '2024-02-04T13:02:49.721Z', value1: 0.5, value2: 0.9, value3: 1 },
];

const sampleChartData = {
  data: sampleData,
  x: 'date',
  seriesData: [
    {
      label: '반입(kbps)',
      y: 'value1',
      fill: '#1ED6FF',
      stroke: '#1ED6FF',
      fillOpacity: 0.5,
    },
    {
      label: '반출(kbps)',
      y: 'value2',
      fill: '#5A3FFF',
      stroke: '#5A3FFF',
      fillOpacity: 0.3,
    },
    {
      label: '평균(4주)',
      y: 'value3',
      fill: '#1ED6FF',
      stroke: '#1ED6FF',
      fillOpacity: 0.7,
    },  
  ],
};

function BarChartData5_tmp({ id, theme = 'dark', chartData = sampleChartData , customHandler = null }) {
  //console.log("@@@@ ", id ," @@@@");
  return (
    <Stack sx={{ mt: 1, height: '100%' }}>
      <XYChart5_tmp id={id} theme={theme} chartData={chartData} customHandler={customHandler} />
    </Stack>
  );
}

export default BarChartData5_tmp;
