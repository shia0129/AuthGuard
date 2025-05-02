// libraries
import { useState } from 'react';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import TabTheme from '@components/modules/tab/TabTheme';
import ProtocolMinute from './protocol/protocolMinute';
import ProtocolHour from './protocol/protocolHour';
import ProtocolDay from './protocol/protocolDay';
import ProtocolMonth from './protocol/protocolMonth';

function ProtocolStatistics() {
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
      {tabIndex === '1' && <ProtocolMinute />}
      {tabIndex === '2' && <ProtocolHour />}
      {tabIndex === '3' && <ProtocolDay />}
      {tabIndex === '4' && <ProtocolMonth />}
    </GridItem>
  );
}

ProtocolStatistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProtocolStatistics;
