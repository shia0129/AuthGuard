// libraries
import { useState } from 'react';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import TabTheme from '@components/modules/tab/TabTheme';
import DepartMinute from './depart/departMinute';
import DepartHour from './depart/departHour';
import DepartDay from './depart/departDay';
import DepartMonth from './depart/departMonth';
import DepartMinuteGraph from './depart/departMinuteGraph';
import DepartHourGraph from './depart/departHourGraph';
import DepartDayGraph from './depart/departDayGraph';
import DepartMonthGraph from './depart/departMonthGraph';

function DepartStatistics() {
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
      {tabIndex === '1' && <DepartMinute />}
      {tabIndex === '2' && <DepartHour />}
      {tabIndex === '3' && <DepartDay />}
      {tabIndex === '4' && <DepartMonth />}
      {tabIndex === '5' && <DepartMinuteGraph />}
      {tabIndex === '6' && <DepartHourGraph />}
      {tabIndex === '7' && <DepartDayGraph />}
      {tabIndex === '8' && <DepartMonthGraph />}
    </GridItem>
  );
}

DepartStatistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default DepartStatistics;
