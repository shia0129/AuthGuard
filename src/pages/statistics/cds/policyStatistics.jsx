// libraries
import { useState } from 'react';
// components
import Layout from '@components/layouts';
import GridItem from '@components/modules/grid/GridItem';
import TabTheme from '@components/modules/tab/TabTheme';
import PolicyDay from './policy/policyDay';
import PolicyMonth from './policy/policyMonth';

function PolicyStatistics() {
  const tabList = [
    {
      label: '일별',
      value: '1',
    },
    {
      label: '월별',
      value: '2',
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
      {tabIndex === '1' && <PolicyDay />}
      {tabIndex === '2' && <PolicyMonth />}
    </GridItem>
  );
}

PolicyStatistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PolicyStatistics;
