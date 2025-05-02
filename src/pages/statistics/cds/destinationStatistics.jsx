// libraries
import { useState } from 'react';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import TabTheme from '@components/modules/tab/TabTheme';
import DestinationMinute from './destination/destinationMinute';
import DestinationHour from './destination/destinationHour';
import DestinationDay from './destination/destinationDay';
import DestinationMonth from './destination/destinationMonth';
import DestinationMinuteGraph from './destination/destinationMinuteGraph';
import DestinationHourGraph from './destination/destinationHourGraph';
import DestinationDayGraph from './destination/destinationDayGraph';
import DestinationMonthGraph from './destination/destinationMonthGraph';

function DestinationStatistics() {
  const tabList = [
    {
      label: '분별',
      value: '1',
    },
    {
      label: '시간별',
      value: '2',
    },
    {
      label: '일별',
      value: '3',
    },
    {
      label: '월별',
      value: '4',
    },
    {
      label: '분별.그래프',
      value: '5',
    },
    {
      label: '시간별.그래프',
      value: '6',
    },
    {
      label: '일별.그래프',
      value: '7',
    },
    {
      label: '월별.그래프',
      value: '8',
    },
  ];

  const [tabIndex, setTabIndex] = useState('1');

  return (
    <GridItem item xs={12}>
      <TabTheme
        tabsValue={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        tabOutline
        tabList={tabList}
      />
      {tabIndex === '1' && <DestinationMinute />}
      {tabIndex === '2' && <DestinationHour />}
      {tabIndex === '3' && <DestinationDay />}
      {tabIndex === '4' && <DestinationMonth />}
      {tabIndex === '5' && <DestinationMinuteGraph />}
      {tabIndex === '6' && <DestinationHourGraph />}
      {tabIndex === '7' && <DestinationDayGraph />}
      {tabIndex === '8' && <DestinationMonthGraph />}
    </GridItem>
  );
}

DestinationStatistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DestinationStatistics;
